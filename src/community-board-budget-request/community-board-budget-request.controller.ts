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
import { unparse } from "papaparse";

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
      cbbrAgencyCategoryResponseIds,
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
      cbbrAgencyCategoryResponseIds,
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

  @Get("/csv")
  async findCsv(
    @Res() res: Response,
    @Query(
      new ZodTransformPipe(findCommunityBoardBudgetRequestsQueryParamsSchema),
    )
    {
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrAgencyCategoryResponseIds,
      cbbrNeedGroupId,
      cbbrPolicyAreaId,
      cbbrType,
      agencyInitials,
      isContinuedSupport,
      isMapped,
    }: FindCommunityBoardBudgetRequestsQueryParams,
  ) {
    const data = await this.communityBoardBudgetRequestService.findCsv({
      communityDistrictCombinedId: communityDistrictId,
      cityCouncilDistrictId,
      cbbrAgencyCategoryResponseIds,
      cbbrNeedGroupId,
      cbbrPolicyAreaId,
      cbbrType,
      agencyInitials,
      isContinuedSupport,
      isMapped,
    });

    // const csvData = unparse(data, { header: false });
    const csvData = `Tracking Number,Community Board Number,Address,Site or Facility Name,Street Segment - On Street,Street Segment - Cross Street 1,Street Segment - Cross Street 2,Intersection - Street 1,Intersection - Street 2,Type,Is Continued Support,CB Request,CB Explanation,Agency Acronym,Priority,Agency Response,Agency Response Explanation\n${unparse(data, { header: false })}`;

    res.set("Content-Type", "application/csv");
    res.set(
      "Content-Disposition",
      `attachment; filename=CPP_CBBR_Export_${String(new Date().getDate()).padStart(2, "0")}_${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date().getMonth()]}_${new Date().getFullYear()}.csv`,
    );
    res.send(csvData);
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

  @Get("/agency-category-responses")
  async findAgencyCategoryResponses() {
    return this.communityBoardBudgetRequestService.findAgencyCategoryResponses();
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
