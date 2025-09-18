import { Module } from "@nestjs/common";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestController } from "./community-board-budget-request.controller";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { BoroughRepository } from "src/borough/borough.repository";

@Module({
  exports: [CommunityBoardBudgetRequestService],
  providers: [
    CommunityBoardBudgetRequestService,
    CommunityBoardBudgetRequestRepository,
    AgencyRepository,
    BoroughRepository,
  ],
  controllers: [CommunityBoardBudgetRequestController],
})
export class CommunityBoardBudgetRequestModule {}
