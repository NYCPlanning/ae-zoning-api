import { Controller, Get, UseFilters } from "@nestjs/common";
import { CityCouncilDistrictService } from "./city-council-district.service";
import { InternalServerErrorExceptionFilter } from "src/filter";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("city-council-districts")
export class CityCouncilDistrictController {
  constructor(
    private readonly cityCouncilDistrictService: CityCouncilDistrictService,
  ) {}

  @Get()
  async findMany() {
    return this.cityCouncilDistrictService.findMany();
  }
}
