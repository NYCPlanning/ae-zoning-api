import { createZodDto } from 'nestjs-zod';
import { findTaxLotsQueryParamsSchema } from 'src/gen';

export class FindTaxLotsQueryParamsDto extends createZodDto(findTaxLotsQueryParamsSchema) {}