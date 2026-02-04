import { Module } from "@nestjs/common";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestController } from "./community-board-budget-request.controller";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { CommunityDistrictModule } from "src/community-district/community-district.module";
import { CityCouncilDistrictModule } from "src/city-council-district/city-council-district.module";
import { AgencyModule } from "src/agency/agency.module";
import { BoroughModule } from "src/borough/borough.module";

@Module({
  imports: [
    AgencyModule,
    BoroughModule,
    CommunityDistrictModule,
    CityCouncilDistrictModule,
  ],
  exports: [
    CommunityBoardBudgetRequestService,
    CommunityBoardBudgetRequestRepository,
  ],
  providers: [
    CommunityBoardBudgetRequestService,
    CommunityBoardBudgetRequestRepository,
  ],
  controllers: [CommunityBoardBudgetRequestController],
})
export class CommunityBoardBudgetRequestModule {}
