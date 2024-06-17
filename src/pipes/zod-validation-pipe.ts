import { PipeTransform } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import { ZodObject, ZodOptional, ZodRawShape } from "zod";
export class ZodValidationPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T> | ZodOptional<ZodObject<T>>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new InvalidRequestParameterException();
    }
    return value;
  }
}
