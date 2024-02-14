import { PipeTransform } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import { ZodObject } from "zod";
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      console.log(value);
      this.schema.parse(value);
    } catch (error) {
      throw new InvalidRequestParameterException();
    }
    return value;
  }
}
