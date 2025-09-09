import { Module } from "@nestjs/common";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestController } from "./community-board-budget-request.controller";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";

@Module({
  exports: [CommunityBoardBudgetRequestService],
  providers: [
    CommunityBoardBudgetRequestService,
    CommunityBoardBudgetRequestRepository,
  ],
  controllers: [CommunityBoardBudgetRequestController],
})
export class CommunityBoardBudgetRequestModule {}
