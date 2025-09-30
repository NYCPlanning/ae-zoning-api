import { Module } from "@nestjs/common";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestController } from "./community-board-budget-request.controller";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";

@Module({
  exports: [CommunityBoardBudgetRequestService],
  providers: [
    CommunityBoardBudgetRequestService,
    CommunityBoardBudgetRequestRepository,
    AgencyRepository,
    CityCouncilDistrictRepository,
    CommunityDistrictRepository,
  ],
  controllers: [CommunityBoardBudgetRequestController],
})
export class CommunityBoardBudgetRequestModule {}
