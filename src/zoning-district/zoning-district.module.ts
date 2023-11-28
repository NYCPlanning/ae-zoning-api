import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictController } from "./zoning-district.controller";

import { ZoningDistrictClass } from "../zoning-district-class/zoning-district-class.entity";
import { ZoningDistrictClassRepository } from "../zoning-district-class/zoning-district-class.repository";

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [ZoningDistrict, ZoningDistrictClass],
    }),
  ],
  exports: [ZoningDistrictService, ZoningDistrictClassRepository],
  providers: [ZoningDistrictService, ZoningDistrictClassRepository],
  controllers: [ZoningDistrictController],
})
export class ZoningDistrictModule {}
