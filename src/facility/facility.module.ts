import { Module } from "@nestjs/common";
import { FacilityService } from "./facility.service";
import { FacilityController } from "./facility.controller";
import { FacilityRepository } from "./facility.repository";

@Module({
  exports: [FacilityService, FacilityRepository],
  providers: [FacilityService, FacilityRepository],
  controllers: [FacilityController],
})
export class FacilityModule {}
