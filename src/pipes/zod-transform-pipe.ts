import { PipeTransform } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import { ZodRawShape, ZodObject, ZodOptional, ZodArray } from "zod";
export class ZodTransformPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T> | ZodOptional<ZodObject<T>>) {}

  transform(
    params: Record<string, string | Array<string>>,
  ): Record<string, string | Array<string>> {
    const schemaProperties =
      this.schema instanceof ZodOptional
        ? this.schema.unwrap().shape
        : this.schema.shape;

    console.debug(params);

    const decodedParams: Record<
      string,
      string | number | Array<string> | Array<number>
    > = {};

    Object.entries(params).forEach(([param, value]) => {
      const schema = schemaProperties[param];
      const property = schema instanceof ZodOptional ? schema.unwrap() : schema;

      decodedParams[param] = !(property instanceof ZodArray)
        ? value
        : Array.isArray(value)
          ? value
          : value.split(",");
    });

    try {
      const parsedParams = this.schema.parse(decodedParams);
      if (parsedParams === undefined) throw new Error();
      return parsedParams;
    } catch (error) {
      throw new InvalidRequestParameterException();
    }
  }
}
