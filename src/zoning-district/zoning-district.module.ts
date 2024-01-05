import { Module } from "@nestjs/common";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictController } from "./zoning-district.controller";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  exports: [ZoningDistrictService],
  providers: [ZoningDistrictService, ZoningDistrictRepository],
  controllers: [ZoningDistrictController],
})
export class ZoningDistrictModule {}
