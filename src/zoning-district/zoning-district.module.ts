import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictController } from "./zoning-district.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [ZoningDistrict] }),
    HttpModule,
  ],
  exports: [ZoningDistrictService],
  providers: [ZoningDistrictService],
  controllers: [ZoningDistrictController],
})
export class ZoningDistrictModule {}
