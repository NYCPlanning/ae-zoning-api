import { Controller, Get, UseFilters } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { InternalServerErrorExceptionFilter } from "src/error";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("boroughs")
export class BoroughController {
  constructor(private readonly boroughService: BoroughService) {}

  @Get()
  async findAll() {
    return this.boroughService.findAll();
  }
}
