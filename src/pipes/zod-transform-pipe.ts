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
        throw new InvalidRequestParameterException("invalid value for boolean schema property");
      }

      decodedParams[param] = value;
    });

    try {
      const parsedParams = this.schema.parse(decodedParams);
      if (parsedParams === undefined) throw new Error();
      return parsedParams;
    } catch (error) {
      throw new InvalidRequestParameterException("no params");
    }
  }
}
