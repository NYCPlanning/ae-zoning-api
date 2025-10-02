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
import { Response } from "express";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import {
  FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  findCommunityBoardBudgetRequestNeedGroupsQueryParamsSchema,
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
  findCommunityBoardBudgetRequestPolicyAreasQueryParamsSchema,
  FindCommunityBoardBudgetRequestAgenciesQueryParams,
  findCommunityBoardBudgetRequestAgenciesQueryParamsSchema,
  FindCommunityBoardBudgetRequestByIdPathParams,
  findCommunityBoardBudgetRequestsQueryParamsSchema,
  FindCommunityBoardBudgetRequestsQueryParams,
  findCommunityBoardBudgetRequestTilesPathParamsSchema,
  FindCommunityBoardBudgetRequestTilesPathParams,
  findCommunityBoardBudgetRequestByIdPathParamsSchema,
} from "src/gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import { findCommunityBoardBudgetRequestGeoJsonByIdPathParamsSchema } from "src/gen/zod/findCommunityBoardBudgetRequestGeoJsonByIdSchema";
import { FindCommunityBoardBudgetRequestGeoJsonByIdPathParams } from "src/gen/types/FindCommunityBoardBudgetRequestGeoJsonById";

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("community-board-budget-requests")
export class CommunityBoardBudgetRequestController {
  constructor(
    private readonly communityBoardBudgetRequestService: CommunityBoardBudgetRequestService,
  ) {}

  @Get("/")
  async findMany(
    @Query(
      new ZodTransformPipe(findCommunityBoardBudgetRequestsQueryParamsSchema),
    )
    {
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrAgencyResponseTypeIds,
      cbbrNeedGroupId,
      cbbrPolicyAreaId,
      cbbrType,
      agencyInitials,
      isContinuedSupport,
      isMapped,
      limit,
      offset,
    }: FindCommunityBoardBudgetRequestsQueryParams,
  ) {
    return await this.communityBoardBudgetRequestService.findMany({
      communityDistrictCombinedId: communityDistrictId,
      cityCouncilDistrictId,
      cbbrAgencyResponseTypeIds,
      cbbrNeedGroupId,
      cbbrPolicyAreaId,
      cbbrType,
      agencyInitials,
      isContinuedSupport,
      isMapped,
      limit,
      offset,
    });
  }

  @Get("/agencies")
  async findAgencies(
    @Query(
      new ZodTransformPipe(
        findCommunityBoardBudgetRequestAgenciesQueryParamsSchema,
      ),
    )
    queryParams: FindCommunityBoardBudgetRequestAgenciesQueryParams,
  ) {
    return this.communityBoardBudgetRequestService.findAgencies(queryParams);
  }

  @Get("/need-groups")
  async findNeedGroups(
    @Query(
      new ZodTransformPipe(
        findCommunityBoardBudgetRequestNeedGroupsQueryParamsSchema,
      ),
    )
    queryParams: FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  ) {
    return this.communityBoardBudgetRequestService.findNeedGroups(queryParams);
  }

  @Get("/policy-areas")
  async findPolicyAreas(
    @Query(
      new ZodTransformPipe(
        findCommunityBoardBudgetRequestPolicyAreasQueryParamsSchema,
      ),
    )
    queryParams: FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
  ) {
    return this.communityBoardBudgetRequestService.findPolicyAreas(queryParams);
  }

  @Get("/agency-response-types")
  async findAgencyResponseTypes() {
    return this.communityBoardBudgetRequestService.findAgencyResponseTypes();
  }

  @Get("/:cbbrId")
  async findById(
    @Param(
      new ZodTransformPipe(findCommunityBoardBudgetRequestByIdPathParamsSchema),
    )
    params: FindCommunityBoardBudgetRequestByIdPathParams,
  ) {
    return this.communityBoardBudgetRequestService.findById(params);
  }

  @UsePipes(
    new ZodTransformPipe(findCommunityBoardBudgetRequestTilesPathParamsSchema),
  )
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCommunityBoardBudgetRequestTilesPathParams,
    @Res() res: Response,
  ) {
    const tile =
      await this.communityBoardBudgetRequestService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/:cbbrId/geojson")
  async findGeoJsonById(
    @Param(
      new ZodTransformPipe(
        findCommunityBoardBudgetRequestGeoJsonByIdPathParamsSchema,
      ),
    )
    params: FindCommunityBoardBudgetRequestGeoJsonByIdPathParams,
  ) {
    return this.communityBoardBudgetRequestService.findGeoJsonById(params);
  }
}
