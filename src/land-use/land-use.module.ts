import { Module } from "@nestjs/common";
import { LandUseService } from "./land-use.service";
import { LandUseController } from "./land-use.controller";
import { LandUseRepository } from "./land-use.repository";

@Module({
  exports: [LandUseService],
  providers: [LandUseService, LandUseRepository],
  controllers: [LandUseController],
})
export class LandUseModule {}
