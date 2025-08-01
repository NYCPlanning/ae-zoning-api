import { PipeTransform } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import { ZodRawShape, ZodObject, ZodOptional, ZodArray, ZodBoolean } from "zod";
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

    Object.entries(params).forEach(([param, value]) => {
      const schema = schemaProperties[param];
      const property = schema instanceof ZodOptional ? schema.unwrap() : schema;

      if (property instanceof ZodArray) {
        decodedParams[param] = Array.isArray(value) ? value : value.split(",");
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
        throw new InvalidRequestParameterException(
          "invalid value for boolean schema property",
        );
      }

      decodedParams[param] = value;
    });

    try {
      const parsedParams = this.schema.parse(decodedParams);
      // It is possible for Zod to return `undefined` when optional parameters are provided `undefined` values
      // Though, this should not be possible within this transform pipe because all values are passed through urls, which are strings
      // However, the type definition doesn't know that the values come from a url.
      // We account for undefined and satisify the type defintion by throwing an error, even though we should never encounter `undefined`
      if (parsedParams === undefined)
        throw new Error("parameters are undefined");
      return parsedParams;
    } catch (e) {
      if (e.message === "parameters are undefined")
        throw new InvalidRequestParameterException(e.message);

      const errorMessages: Array<string> = [];
      const { errors } = e as {
        errors: Array<{ path: Array<string | number>; message: string }>;
      };
      errors.forEach((error) => {
        const parameter = error.path[0]; // first position of array holds the parameter name
        const { message } = error;
        errorMessages.push(`${parameter}: ${message}`);
      });
      throw new InvalidRequestParameterException(errorMessages.join("; "));
    }
  }
}
