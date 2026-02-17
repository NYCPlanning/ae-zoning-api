import { Module } from "@nestjs/common";
import { SpatialRepository } from "./spatial.repository";

@Module({
  exports: [SpatialRepository],
  providers: [SpatialRepository],
})
export class SpatialModule {}
