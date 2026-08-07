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
import {
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
  BadRequestExceptionFilter,
} from "src/filter";
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
import { unparse } from "papaparse";

@UseFilters(
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
  BadRequestExceptionFilter,
)
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

  @Get("/csv")
  async findCsv(
    @Res() res: Response,
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
    }: FindFacilitiesQueryParams,
  ) {
    const data = await this.facilityService.findCsv({
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
    });

    const csvData = `ID,Name,Address,BIN,BBL,Oversight Agency,Jurisdiction,Operator Type,Operator Name,Category,Category Group,Category Subgroup,SGR Letter Grade - Total,SGR Letter Grade - Architectural,SGR Letter Grade - Systems / M&E,SGR Assessment Year\n${unparse(data, { header: false })}`;

    res.set("Content-Type", "application/csv");
    res.set(
      "Content-Disposition",
      `attachment; filename=CPP_Facility_Export_${String(new Date().getDate()).padStart(2, "0")}_${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date().getMonth()]}_${new Date().getFullYear()}.csv`,
    );
    res.send(csvData);
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
