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
    @Param() params: FindCommunityBoardBudgetRequestByIdPathParams,
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
}
