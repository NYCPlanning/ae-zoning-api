import { Module } from "@nestjs/common";
import { CityCouncilDistrictService } from "./city-council-district.service";
import { CityCouncilDistrictController } from "./city-council-district.controller";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";

@Module({
  exports: [CityCouncilDistrictService],
  providers: [CityCouncilDistrictService, CityCouncilDistrictRepository],
  controllers: [CityCouncilDistrictController],
})
export class CityCouncilDistrictModule {}
