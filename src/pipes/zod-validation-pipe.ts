import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodObject } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(
        "Invalid request parameter data type or format",
      );
    }
    return value;
  }
}
