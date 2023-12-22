import { Module } from "@nestjs/common";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictController } from "./zoning-district.controller";
import { ZoningDistrictRepo } from "./zoning-district.repo";

@Module({
  exports: [ZoningDistrictService],
  providers: [ZoningDistrictService, ZoningDistrictRepo],
  controllers: [ZoningDistrictController],
})
export class ZoningDistrictModule {}
