import { Module } from "@nestjs/common";
import { ZoningDistrictClassController } from "./zoning-district-class.controller";
import { ZoningDistrictClassService } from "./zoning-district-class.service";

@Module({
  exports: [ZoningDistrictClassService],
  providers: [ZoningDistrictClassService],
  controllers: [ZoningDistrictClassController],
})
export class ZoningDistrictClassModule {}
