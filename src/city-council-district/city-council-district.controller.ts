import {
  Controller,
  Get,
  Param,
  Res,
  Query,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { CityCouncilDistrictService } from "./city-council-district.service";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import {
  FindCityCouncilDistrictTilesPathParams,
  findCityCouncilDistrictTilesPathParamsSchema,
} from "src/gen";
import { Response } from "express";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import {
  FindCapitalProjectsByCityCouncilIdPathParams,
  FindCapitalProjectsByCityCouncilIdQueryParams,
  findCapitalProjectsByCityCouncilIdPathParamsSchema,
  findCapitalProjectsByCityCouncilIdQueryParamsSchema,
} from "src/gen";

@UseFilters(
  InternalServerErrorExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("city-council-districts")
export class CityCouncilDistrictController {
  constructor(
    private readonly cityCouncilDistrictService: CityCouncilDistrictService,
  ) {}

  @Get()
  async findMany() {
    return this.cityCouncilDistrictService.findMany();
  }

  @UsePipes(new ZodTransformPipe(findCityCouncilDistrictTilesPathParamsSchema))
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCityCouncilDistrictTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.cityCouncilDistrictService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }
  @Get("/:cityCouncilDistrictId/capital-projects")
  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectsByCityCouncilIdPathParamsSchema
        .merge(findCapitalProjectsByCityCouncilIdQueryParamsSchema.unwrap())
        .partial(),
    ),
  )
  async findCapitalProjectsById(
    @Param() pathParams: FindCapitalProjectsByCityCouncilIdPathParams,
    @Query() queryParams: FindCapitalProjectsByCityCouncilIdQueryParams,
  ) {
    return await this.cityCouncilDistrictService.findCapitalProjectsById({
      ...pathParams,
      ...queryParams,
    });
  }
}
