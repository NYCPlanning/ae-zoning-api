import { Controller, Get, Param, Query, UseFilters } from "@nestjs/common";
import { FacilityService } from "./facility.service";
import { InternalServerErrorExceptionFilter } from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import {
  FindFacilitiesQueryParams,
  findFacilitiesQueryParamsSchema,
  FindFacilityByIdPathParams,
  findFacilityByIdPathParamsSchema,
} from "src/gen";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("facilities")
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Get("/")
  async findMany(
    @Query(new ZodTransformPipe(findFacilitiesQueryParamsSchema))
    {
      boroughIds,
      facilityJurisdictions,
      facilityOperatorTypes,
      facilityOversightAgency,
      facilityCategoryIds,
      facilityGroupIds,
      facilitySubgroupIds,
      communityDistrictIds,
      cityCouncilDistrictIds,
      bbl,
      bin,
      geometry,
      lons,
      lats,
      buffer,
      limit,
      offset,
    }: FindFacilitiesQueryParams,
  ) {
    return this.facilityService.findMany({
      boroughIds,
      facilityJurisdictions,
      facilityOperatorTypes,
      facilityOversightAgency,
      facilityCategoryIds,
      facilityGroupIds,
      facilitySubgroupIds,
      communityDistrictIds,
      cityCouncilDistrictIds,
      bbl,
      bin,
      geometry,
      lons,
      lats,
      buffer,
      limit,
      offset,
    });
  }

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
