import {
  Controller,
  Get,
  Param,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { HousingGrowthService } from "./housing-growth.service";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import {
  FindHousingGrowthByBoroughTilesPathParams,
  findHousingGrowthByBoroughTilesPathParamsSchema,
  FindHousingGrowthByCommunityDistrictTilesPathParams,
  findHousingGrowthByCommunityDistrictTilesPathParamsSchema,
  FindHousingGrowthByNeighborhoodTabulationAreaTilesPathParams,
  findHousingGrowthByNeighborhoodTabulationAreaTilesPathParamsSchema,
} from "src/gen";
import { Response } from "express";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";

@UseFilters(
  InternalServerErrorExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("housing-growth")
export class HousingGrowthController {
  constructor(private readonly housingGrowthService: HousingGrowthService) {}

  @UsePipes(
    new ZodTransformPipe(findHousingGrowthByBoroughTilesPathParamsSchema),
  )
  @Get("/boroughs/:z/:x/:y.pbf")
  async findBoroughsTiles(
    @Param() params: FindHousingGrowthByBoroughTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.housingGrowthService.findBoroughsTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @UsePipes(
    new ZodTransformPipe(
      findHousingGrowthByCommunityDistrictTilesPathParamsSchema,
    ),
  )
  @Get("/community-districts/:z/:x/:y.pbf")
  async findCommunityDistrictsTiles(
    @Param() params: FindHousingGrowthByCommunityDistrictTilesPathParams,
    @Res() res: Response,
  ) {
    const tile =
      await this.housingGrowthService.findCommunityDistrictsTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @UsePipes(
    new ZodTransformPipe(
      findHousingGrowthByNeighborhoodTabulationAreaTilesPathParamsSchema,
    ),
  )
  @Get("/neighborhood-tabulation-areas/:z/:x/:y.pbf")
  async findNeighborhoodTabulationAreasTiles(
    @Param()
    params: FindHousingGrowthByNeighborhoodTabulationAreaTilesPathParams,
    @Res() res: Response,
  ) {
    const tile =
      await this.housingGrowthService.findNeighborhoodTabulationAreasTiles(
        params,
      );
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }
}
