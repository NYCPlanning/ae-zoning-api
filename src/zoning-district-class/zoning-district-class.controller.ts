import { Controller, Get, Param } from "@nestjs/common";
import { ZoningDistrictClassService } from "./zoning-district-class.service";

@Controller("zoning-district-classes")
export class ZoningDistrictClassController {
  constructor(
    private readonly zoningDistrictService: ZoningDistrictClassService,
  ) {}

  @Get()
  async findAllZoningDistrictClasses() {
    return this.zoningDistrictService.findAllZoningDistrictClasses();
  }

  @Get("/category-colors")
  async findZoningDistrictClassCategoryColors() {
    return this.zoningDistrictService.findZoningDistrictClassCategoryColors();
  }

  @Get("/:id")
  async findZoningDistrictClassById(@Param() params: { id: string }) {
    return this.zoningDistrictService.findZoningDistrictClassById(params.id);
  }
}
