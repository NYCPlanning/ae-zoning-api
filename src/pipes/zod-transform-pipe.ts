import { PipeTransform } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import {
  ZodRawShape,
  ZodObject,
  ZodOptional,
  ZodArray,
  ZodBoolean,
  ZodError,
  ZodNumber,
} from "zod";
export class ZodTransformPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T> | ZodOptional<ZodObject<T>>) {}

  transform(
    params: Record<string, string | Array<string>>,
  ): Record<string, string | Array<string>> {
    const schemaProperties =
      this.schema instanceof ZodOptional
        ? this.schema.unwrap().shape
        : this.schema.shape;

    const decodedParams: Record<
      string,
      boolean | string | number | Array<string> | Array<number>
    > = {};

    const parsingExceptionMessages: Array<string> = [];
    Object.entries(params).forEach(([param, value]) => {
      const parameterSchema = schemaProperties[param];
      const property =
        parameterSchema instanceof ZodOptional
          ? parameterSchema.unwrap()
          : parameterSchema;

      if (property instanceof ZodArray) {
        const items = Array.isArray(value) ? value : value.split(",");
        const parsedItems =
          property.element instanceof ZodNumber
            ? items
                .map((item) => {
                  const f = parseFloat(item);
                  if (isNaN(f)) {
                    parsingExceptionMessages.push(
                      `${param}: Expected number, received nan`,
                    );
                    return null;
                  }
                  return f;
                })
                .filter((item) => item !== null)
            : items;

        decodedParams[param] = parsedItems;
        return;
      }

      if (property instanceof ZodNumber) {
        if (Array.isArray(value)) {
          parsingExceptionMessages.push(`${param}: Expected number`);
          return;
        }
        const f = parseFloat(value);
        if (isNaN(f)) {
          parsingExceptionMessages.push(
            `${param}: Expected number, received nan`,
          );
          return;
        }
        decodedParams[param] = f;
        return;
      }

      if (property instanceof ZodBoolean) {
        if (value === "true") {
          decodedParams[param] = true;
          return;
        }
        if (value === "false") {
          decodedParams[param] = false;
          return;
        }
        parsingExceptionMessages.push(
          "invalid value for boolean schema property",
        );
      }

      decodedParams[param] = value;
    });

    if (parsingExceptionMessages.length > 0)
      throw new InvalidRequestParameterException(
        parsingExceptionMessages.join("; "),
      );
    try {
      const parsedParams = this.schema.parse(decodedParams);
      // It is possible for Zod to return `undefined` when optional parameters are provided `undefined` values
      // Though, this should not be possible within this transform pipe because all values are passed through urls, which are strings
      // However, the type definition doesn't know that the values come from a url.
      // We account for undefined and satisify the type defintion by throwing an error, even though we should never encounter `undefined`
      if (parsedParams === undefined) throw new Error();
      return parsedParams;
    } catch (e) {
      if (e instanceof ZodError) {
        const errorMessages: Array<string> = [];
        const { errors } = e;
        errors.forEach((error) => {
          const parameter = error.path[0]; // first position of array holds the parameter name
          const { message } = error;
          errorMessages.push(`${parameter}: ${message}`);
        });
        throw new InvalidRequestParameterException(errorMessages.join("; "));
      }
      throw new InvalidRequestParameterException("unable to parse parameters");
    }
  }
}
