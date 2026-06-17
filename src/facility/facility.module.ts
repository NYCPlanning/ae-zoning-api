import { Module } from "@nestjs/common";
import { FacilityService } from "./facility.service";
import { FacilityController } from "./facility.controller";
import { FacilityRepository } from "./facility.repository";
import { SpatialRepository } from "src/spatial/spatial.repository";

@Module({
  exports: [FacilityService, FacilityRepository],
  providers: [FacilityService, FacilityRepository, SpatialRepository],
  controllers: [FacilityController],
})
export class FacilityModule {}
