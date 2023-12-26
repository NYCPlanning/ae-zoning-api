import { Module } from "@nestjs/common";
import { ZoningDistrictClassController } from "./zoning-district-class.controller";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZoningDistrictClassRepo } from "./zoning-district-class.repo";

@Module({
  exports: [ZoningDistrictClassService],
  providers: [ZoningDistrictClassService, ZoningDistrictClassRepo],
  controllers: [ZoningDistrictClassController],
})
export class ZoningDistrictClassModule {}
