import { Module } from "@nestjs/common";
import { FacilityService } from "./facility.service";
import { FacilityController } from "./facility.controller";
import { FacilityRepository } from "./facility.repository";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { SpatialService } from "src/spatial/spatial.service";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { BoroughRepository } from "src/borough/borough.repository";
import { AgencyRepository } from "src/agency/agency.repository";

@Module({
  exports: [FacilityService, FacilityRepository],
  providers: [
    FacilityService,
    FacilityRepository,
    SpatialRepository,
    SpatialService,
    CityCouncilDistrictRepository,
    CommunityDistrictRepository,
    BoroughRepository,
    AgencyRepository,
  ],
  controllers: [FacilityController],
})
export class FacilityModule {}
