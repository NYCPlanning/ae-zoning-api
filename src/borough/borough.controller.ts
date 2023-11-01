import { Controller, Get } from "@nestjs/common";
import { BoroughService } from "./borough.service";

@Controller("boroughs")
export class BoroughController {
  constructor(private readonly boroughService: BoroughService) {}

  @Get()
  async findAll() {
    return this.boroughService.findAll();
  }
}
