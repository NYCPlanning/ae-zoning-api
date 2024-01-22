import { Controller, Get, UseFilters } from "@nestjs/common";
import { LandUseService } from "./land-use.service";
import { InternalServerErrorExceptionFilter } from "src/filter";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("land-uses")
export class LandUseController {
  constructor(private readonly landUseService: LandUseService) {}

  @Get()
  async findMany() {
    return this.landUseService.findMany();
  }
}
