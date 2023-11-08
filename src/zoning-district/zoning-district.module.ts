import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictController } from "./zoning-district.controller";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [ZoningDistrict] })],
  exports: [ZoningDistrictService],
  providers: [ZoningDistrictService],
  controllers: [ZoningDistrictController],
})
export class ZoningDistrictModule {}
