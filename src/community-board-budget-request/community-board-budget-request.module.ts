import { Module } from "@nestjs/common";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestController } from "./community-board-budget-request.controller";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { CommunityDistrictModule } from "src/community-district/community-district.module";
import { CityCouncilDistrictModule } from "src/city-council-district/city-council-district.module";
import { BoroughModule } from "src/borough/borough.module";
import { AgencyModule } from "src/agency/agency.module";
import { SpatialModule } from "src/spatial/spatial.module";

@Module({
  imports: [
    AgencyModule,
    CommunityDistrictModule,
    CityCouncilDistrictModule,
    SpatialModule,
    BoroughModule,
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
export class CommunityBoardBudgetRequestModule { }
