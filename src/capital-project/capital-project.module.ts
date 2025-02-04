import { Module } from "@nestjs/common";
import { CapitalProjectController } from "./capital-project.controller";
import { CapitalProjectService } from "./capital-project.service";
import { CapitalProjectRepository } from "./capital-project.repository";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";

@Module({
  exports: [CapitalProjectService],
  providers: [
    CapitalProjectService,
    CapitalProjectRepository,
    CityCouncilDistrictRepository,
    CommunityDistrictRepository,
  ],
  controllers: [CapitalProjectController],
})
export class CapitalProjectModule {}
