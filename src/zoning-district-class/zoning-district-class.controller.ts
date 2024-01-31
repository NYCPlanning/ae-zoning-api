import { Controller, Get, Param, UseFilters, UsePipes } from "@nestjs/common";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema,
  FindZoningDistrictClassByZoningDistrictClassIdPathParams,
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
    private readonly zoningDistrictClassService: ZoningDistrictClassService,
  ) {}

  @Get()
  async findMany() {
    return this.zoningDistrictClassService.findMany();
  }

  @Get("/category-colors")
  async findCategoryColors() {
    return this.zoningDistrictClassService.findCategoryColors();
  }

  @Get("/:id")
  @UsePipes(
    new ZodValidationPipe(
      findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema,
    ),
  )
  async findById(
    @Param() params: FindZoningDistrictClassByZoningDistrictClassIdPathParams,
  ) {
    return this.zoningDistrictClassService.findById(params.id);
  }
}
