import { Controller, Get, Param, UseFilters, UsePipes } from "@nestjs/common";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  GetZoningDistrictClassesByIdPathParams,
  getZoningDistrictClassesByIdPathParamsSchema,
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";

@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
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
  @UsePipes(new ZodValidationPipe(getZoningDistrictClassesByIdPathParamsSchema))
  async findZoningDistrictClassById(
    @Param() params: GetZoningDistrictClassesByIdPathParams,
  ) {
    return this.zoningDistrictService.findZoningDistrictClassById(params.id);
  }
}
