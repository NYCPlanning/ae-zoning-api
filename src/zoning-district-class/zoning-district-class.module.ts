import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ZoningDistrictClass } from "./zoning-district-class.entity";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZoningDistrictClassController } from "./zoning-district-class.controller";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [ZoningDistrictClass] })],
  exports: [ZoningDistrictClassService],
  providers: [ZoningDistrictClassService],
  controllers: [ZoningDistrictClassController],
})

export class ZoningDistrictModule {}
