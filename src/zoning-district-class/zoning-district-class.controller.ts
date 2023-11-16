import { Controller, Get, Param } from "@nestjs/common";
import { ZoningDistrictClassService } from "./zoning-district-class.service";

@Controller("zoning-district-classes")
export class ZoningDistrictClassController {
  constructor(
    private readonly zoningDistrictClassService: ZoningDistrictClassService,
  ) {}

  @Get()
  async findAllZoningDistrictClasses() {
    return this.zoningDistrictClassService.findAllZoningDistrictClasses();
  }

  @Get("/:id")
  async findZoningDistrictClassById(@Param() params: { id: string }) {
    return this.zoningDistrictClassService.findZoningDistrictClassById(
      params.id,
    );
  }
}
