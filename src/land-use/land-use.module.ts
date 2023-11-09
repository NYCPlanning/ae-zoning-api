import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { LandUse } from "./land-use.entity";
import { LandUseService } from "./land-use.service";
import { LandUseController } from "./land-use.controller";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [LandUse] })],
  exports: [LandUseService],
  providers: [LandUseService],
  controllers: [LandUseController],
})
export class LandUseModule {}
