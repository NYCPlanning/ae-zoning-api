import { Module } from "@nestjs/common";
import { FacilityService } from "./facility.service";
import { FacilityController } from "./facility.controller";
import { FacilityRepository } from "./facility.repository";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { SpatialService } from "src/spatial/spatial.service";

@Module({
  exports: [FacilityService, FacilityRepository],
  providers: [
    FacilityService,
    FacilityRepository,
    SpatialRepository,
    SpatialService,
  ],
  controllers: [FacilityController],
})
export class FacilityModule {}
