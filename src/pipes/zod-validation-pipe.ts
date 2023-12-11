import { PipeTransform } from "@nestjs/common";
import { ZodObject } from "zod";
import { InvalidRequestParameterException } from "../error";
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw InvalidRequestParameterException;
    }
    return value;
  }
}
