import { Controller, Get, Param } from "@nestjs/common";
import { ZoningDistrictService } from "./zoning-district.service";

@Controller("zoning-districts")
export class ZoningDistrictController {
  constructor(private readonly zoningDistrictService: ZoningDistrictService) {}

  @Get("/:id")
  async findById(@Param() params: { id: string }) {
    return this.zoningDistrictService.findById(params.id);
  }
}