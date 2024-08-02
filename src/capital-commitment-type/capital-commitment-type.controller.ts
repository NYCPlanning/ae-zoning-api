import { Controller, Get, UseFilters } from "@nestjs/common";
import { CapitalCommitmentTypeService } from "./capital-commitment.service";
import { InternalServerErrorExceptionFilter } from "src/filter";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("capital-commitment-types")
export class CapitalCommitmentTypeController {
  constructor(
    private readonly capitalCommitmentType: CapitalCommitmentTypeService,
  ) {}

  @Get()
  async findMany() {
    return this.capitalCommitmentType.findMany();
  }
}
