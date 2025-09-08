import { Controller, Get, Injectable, Query, UseFilters } from "@nestjs/common";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import {
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
  findCommunityBoardBudgetRequestPolicyAreasQueryParamsSchema,
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
}
