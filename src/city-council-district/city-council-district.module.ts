import { Module } from "@nestjs/common";
import { CityCouncilDistrictService } from "./city-council-district.service";
import { CityCouncilDistrictController } from "./city-council-district.controller";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";
import { CapitalProjectService } from "src/capital-project/capital-project.service";
import { BoroughRepository } from "src/borough/borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";

@Module({
  exports: [CityCouncilDistrictService],
  providers: [
    AgencyRepository,
    AgencyBudgetRepository,
    BoroughRepository,
    CapitalProjectRepository,
    CapitalProjectService,
    CityCouncilDistrictService,
    CityCouncilDistrictRepository,
    CommunityDistrictRepository,
  ],
  controllers: [CityCouncilDistrictController],
})
export class CityCouncilDistrictModule {}
