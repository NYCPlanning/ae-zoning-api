import { Controller, Get, UseFilters } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { InternalServerErrorExceptionFilter } from "src/filter";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("boroughs")
export class BoroughController {
  constructor(private readonly boroughService: BoroughService) {}

  @Get()
  async findMany() {
    return this.boroughService.findMany();
  }
}
