import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { Response } from "express";
import {
  FindBoroughGeoJsonByBoroughIdPathParams,
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams,
  FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams,
  FindCommunityDistrictsByBoroughIdPathParams,
  findBoroughGeoJsonByBoroughIdPathParamsSchema,
  findCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParamsSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdPathParamsSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdQueryParamsSchema,
  findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParamsSchema,
  findCommunityDistrictsByBoroughIdPathParamsSchema,
} from "src/gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("boroughs")
export class BoroughController {
  constructor(private readonly boroughService: BoroughService) {}

  @Get()
  async findMany() {
    return this.boroughService.findMany();
  }

  @Get("/:boroughId/geojson")
  @UsePipes(new ZodTransformPipe(findBoroughGeoJsonByBoroughIdPathParamsSchema))
  async findGeoJsonById(
    @Param() params: FindBoroughGeoJsonByBoroughIdPathParams,
  ) {
    return await this.boroughService.findGeoJsonById(params);
  }

  @Get("/:boroughId/community-districts")
  @UsePipes(
    new ZodTransformPipe(findCommunityDistrictsByBoroughIdPathParamsSchema),
  )
  async findCommunityDistrictsById(
    @Param() params: FindCommunityDistrictsByBoroughIdPathParams,
  ) {
    return this.boroughService.findCommunityDistrictsByBoroughId(
      params.boroughId,
    );
  }

  @UsePipes(
    new ZodTransformPipe(
      findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParamsSchema,
    ),
  )
  @Get("/:boroughId/community-districts/:communityDistrictId/geojson")
  async findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId(
    @Param()
    params: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams,
  ) {
    return this.boroughService.findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId(
      params,
    );
  }

  @Get("/:boroughId/community-districts/:communityDistrictId/capital-projects")
  async findCapitalProjectsByBoroughIdCommunityDistrictId(
    @Param(
      new ZodTransformPipe(
        findCapitalProjectsByBoroughIdCommunityDistrictIdPathParamsSchema,
      ),
    )
    pathParams: FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams,
    @Query(
      new ZodTransformPipe(
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryParamsSchema,
      ),
    )
    queryParams: FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams,
  ) {
    return this.boroughService.findCapitalProjectsByBoroughIdCommunityDistrictId(
      { ...pathParams, ...queryParams },
    );
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParamsSchema,
    ),
  )
  @Get(
    "/:boroughId/community-districts/:communityDistrictId/capital-projects/:z/:x/:y.pbf",
  )
  async findCapitalProjectTilesByBoroughIdCommunityDistrictId(
    @Param()
    params: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
    @Res() res: Response,
  ) {
    const tiles =
      await this.boroughService.findCapitalProjectTilesByBoroughIdCommunityDistrictId(
        params,
      );
    res.set("Content-Type", "application/x-protobuf");
    res.send(tiles);
  }
}
