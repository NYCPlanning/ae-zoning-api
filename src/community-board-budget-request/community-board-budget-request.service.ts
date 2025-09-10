import { Inject, Injectable } from "@nestjs/common";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { FindCommunityBoardBudgetRequestPolicyAreasQueryParams } from "src/gen";

@Injectable()
export class CommunityBoardBudgetRequestService {
  constructor(
    @Inject(CommunityBoardBudgetRequestRepository)
    private readonly communityBoardBudgetRequestRepository: CommunityBoardBudgetRequestRepository,
  ) {}

  async findPolicyAreas(
    params: FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
  ) {
    const cbbrPolicyAreas =
      await this.communityBoardBudgetRequestRepository.findPolicyAreas(params);
    return {
      cbbrPolicyAreas,
    };
  }
}
