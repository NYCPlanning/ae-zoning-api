import { Controller, Get, UseFilters } from "@nestjs/common";
import { AgencyService } from "./agency.service";
import { InternalServerErrorExceptionFilter } from "src/filter";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("agencies")
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get()
  async findMany() {
    return this.agencyService.findMany();
  }
}
