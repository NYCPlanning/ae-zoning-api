import { Module } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";
import { BoroughRepository } from "./borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";
import { CapitalProjectService } from "src/capital-project/capital-project.service";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";

@Module({
  exports: [BoroughService],
  providers: [
    AgencyRepository,
    AgencyBudgetRepository,
    BoroughService,
    BoroughRepository,
    CapitalProjectService,
    CapitalProjectRepository,
    CityCouncilDistrictRepository,
    CommunityDistrictRepository,
  ],
  controllers: [BoroughController],
})
export class BoroughModule {}
