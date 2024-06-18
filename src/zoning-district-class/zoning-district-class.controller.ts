import { Controller, Get, Param, UseFilters, UsePipes } from "@nestjs/common";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import {
  findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema,
  FindZoningDistrictClassByZoningDistrictClassIdPathParams,
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";

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
    new ZodTransformPipe(
      findZoningDistrictClassByZoningDistrictClassIdPathParamsSchema,
    ),
  )
  async findById(
    @Param() params: FindZoningDistrictClassByZoningDistrictClassIdPathParams,
  ) {
    return this.zoningDistrictClassService.findById(params.id);
  }
}
