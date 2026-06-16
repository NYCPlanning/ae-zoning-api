import { Controller, Get, Param, UseFilters } from "@nestjs/common";
import { FacilityService } from "./facility.service";
import { InternalServerErrorExceptionFilter } from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import {
  FindFacilityByIdPathParams,
  findFacilityByIdPathParamsSchema,
} from "src/gen";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("facilities")
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get("/categories")
  async findCategories() {
    return this.facilityService.findCategories();
  }

  @Get("/:facilityId")
  async findById(
    @Param(new ZodTransformPipe(findFacilityByIdPathParamsSchema))
    params: FindFacilityByIdPathParams,
  ) {
    return this.facilityService.findById(params);
  }
}
