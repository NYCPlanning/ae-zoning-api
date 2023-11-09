import { Controller, Get } from "@nestjs/common";
import { LandUseService } from "./land-use.service";

@Controller("land-uses")
export class LandUseController {
  constructor(private readonly landUseService: LandUseService) {}

  @Get()
  async findAll() {
    return this.landUseService.findAll();
  }
}
