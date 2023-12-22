import { Module } from "@nestjs/common";
import { LandUseService } from "./land-use.service";
import { LandUseController } from "./land-use.controller";
import { LandUseRepo } from "./land-use.repo";

@Module({
  exports: [LandUseService],
  providers: [LandUseService, LandUseRepo],
  controllers: [LandUseController],
})
export class LandUseModule {}
