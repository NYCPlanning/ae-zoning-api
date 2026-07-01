import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { Response } from "express";
import { FacilityService } from "./facility.service";
import { InternalServerErrorExceptionFilter } from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import {
  FindFacilitiesQueryParams,
  findFacilitiesQueryParamsSchema,
  FindFacilityByIdPathParams,
  findFacilityByIdPathParamsSchema,
  FindFacilityGeoJsonByIdPathParams,
  findFacilityGeoJsonByIdPathParamsSchema,
  FindFacilityTilesPathParams,
  findFacilityTilesPathParamsSchema,
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

  @Get("/agencies")
  async findAgencies() {
    return this.facilityService.findAgencies();
  }

  @Get("/:facilityId")
  async findById(
    @Param(new ZodTransformPipe(findFacilityByIdPathParamsSchema))
    params: FindFacilityByIdPathParams,
  ) {
    return this.facilityService.findById(params);
  }

  @UsePipes(new ZodTransformPipe(findFacilityTilesPathParamsSchema))
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindFacilityTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.facilityService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/:facilityId/geojson")
  async findGeoJsonById(
    @Param(new ZodTransformPipe(findFacilityGeoJsonByIdPathParamsSchema))
    params: FindFacilityGeoJsonByIdPathParams,
  ) {
    return this.facilityService.findGeoJsonById(params);
  }
}
