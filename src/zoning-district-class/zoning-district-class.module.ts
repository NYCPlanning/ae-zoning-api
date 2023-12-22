import { Module } from "@nestjs/common";
import { ZoningDistrictClassController } from "./zoning-district-class.controller";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";

@Module({
  exports: [ZoningDistrictClassService],
  providers: [ZoningDistrictClassService, ZoningDistrictClassRepository],
  controllers: [ZoningDistrictClassController],
})
export class ZoningDistrictClassModule {}
