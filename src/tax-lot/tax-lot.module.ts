import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotController } from "./tax-lot.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaxLot] }), HttpModule],
  exports: [TaxLotService],
  providers: [TaxLotService],
  controllers: [TaxLotController],
})
export class TaxLotModule {}
