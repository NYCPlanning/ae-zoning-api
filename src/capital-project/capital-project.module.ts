import { forwardRef, Module } from "@nestjs/common";
import { CapitalProjectController } from "./capital-project.controller";
import { CapitalProjectService } from "./capital-project.service";
import { CapitalProjectRepository } from "./capital-project.repository";
import { AgencyModule } from "src/agency/agency.module";
import { AgencyBudgetModule } from "src/agency-budget/agency-budget.module";
import { BoroughModule } from "src/borough/borough.module";
import { CityCouncilDistrictModule } from "src/city-council-district/city-council-district.module";
import { CommunityDistrictModule } from "src/community-district/community-district.module";
import { SpatialModule } from "src/spatial/spatial.module";

@Module({
  imports: [
    AgencyModule,
    AgencyBudgetModule,
    forwardRef(() => BoroughModule),
    forwardRef(() => CityCouncilDistrictModule),
    CommunityDistrictModule,
    SpatialModule,
  ],
  exports: [CapitalProjectService],
  providers: [CapitalProjectService, CapitalProjectRepository],
  controllers: [CapitalProjectController],
})
export class CapitalProjectModule {}
