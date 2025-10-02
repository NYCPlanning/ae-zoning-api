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
  FindCapitalProjectTilesByCityCouncilDistrictIdPathParams,
  findCapitalProjectTilesByCityCouncilDistrictIdPathParamsSchema,
  FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams,
  findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParamsSchema,
  FindCityCouncilDistrictTilesPathParams,
  findCityCouncilDistrictTilesPathParamsSchema,
  FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdPathParams,
  findCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdPathParamsSchema,
} from "src/gen";
import { Response } from "express";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import {
  FindCapitalProjectsByCityCouncilIdPathParams,
  FindCapitalProjectsByCityCouncilIdQueryParams,
  findCapitalProjectsByCityCouncilIdPathParamsSchema,
  findCapitalProjectsByCityCouncilIdQueryParamsSchema,
} from "src/gen";
import { CapitalProjectService } from "src/capital-project/capital-project.service";

@UseFilters(
  InternalServerErrorExceptionFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("city-council-districts")
export class CityCouncilDistrictController {
  constructor(
    private readonly cityCouncilDistrictService: CityCouncilDistrictService,
    private readonly capitalProjectService: CapitalProjectService,
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

  @UsePipes(
    new ZodTransformPipe(
      findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParamsSchema,
    ),
  )
  @Get("/:cityCouncilDistrictId/geojson")
  async findGeoJsonById(
    @Param()
    params: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams,
  ) {
    return this.cityCouncilDistrictService.findGeoJsonById(params);
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectTilesByCityCouncilDistrictIdPathParamsSchema,
    ),
  )
  @Get("/:cityCouncilDistrictId/capital-projects/:z/:x/:y.pbf")
  async findCapitalProjectTilesCityCouncilDistrictId(
    @Param()
    params: FindCapitalProjectTilesByCityCouncilDistrictIdPathParams,
    @Res() res: Response,
  ) {
    const tiles =
      await this.cityCouncilDistrictService.findCapitalProjectTilesByCityCouncilDistrictId(
        params,
      );
    res.set("Content-Type", "application/x-protobuf");
    res.send(tiles);
  }

  @UsePipes(
    new ZodTransformPipe(
      findCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdPathParamsSchema,
    ),
  )
  @Get("/:cityCouncilDistrictId/community-board-budget-requests/:z/:x/:y.pbf")
  async findCommunityBoardBudgetRequestsTilesCityCouncilDistrictId(
    @Param()
    params: FindCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdPathParams,
    @Res() res: Response,
  ) {
    const tiles =
      await this.cityCouncilDistrictService.findCommunityBoardBudgetRequestTilesByCityCouncilDistrictId(
        params,
      );
    res.set("Content-Type", "application/x-protobuf");
    res.send(tiles);
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectsByCityCouncilIdPathParamsSchema
        .merge(findCapitalProjectsByCityCouncilIdQueryParamsSchema.unwrap())
        .partial(),
    ),
  )
  @Get("/:cityCouncilDistrictId/capital-projects")
  async findCapitalProjectsById(
    @Param(
      new ZodTransformPipe(findCapitalProjectsByCityCouncilIdPathParamsSchema),
    )
    pathParams: FindCapitalProjectsByCityCouncilIdPathParams,
    @Query(
      new ZodTransformPipe(findCapitalProjectsByCityCouncilIdQueryParamsSchema),
    )
    queryParams: FindCapitalProjectsByCityCouncilIdQueryParams,
  ) {
    return await this.capitalProjectService.findMany({
      ...pathParams,
      ...queryParams,
    });
  }
}
