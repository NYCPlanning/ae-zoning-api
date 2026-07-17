import { Module } from "@nestjs/common";
import { SpatialRepository } from "./spatial.repository";
import { SpatialService } from "./spatial.service";

@Module({
  exports: [SpatialService, SpatialRepository],
  providers: [SpatialService, SpatialRepository],
})
export class SpatialModule {}
