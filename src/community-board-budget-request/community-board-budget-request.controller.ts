import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  UseFilters,
} from "@nestjs/common";
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
      cbbrAgencyResponseTypeId,
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
      cbbrAgencyResponseTypeId,
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

  @Get("/:cbbrId")
  async findById(
    @Param() params: FindCommunityBoardBudgetRequestByIdPathParams,
  ) {
    return this.communityBoardBudgetRequestService.findById(params);
  }
}
