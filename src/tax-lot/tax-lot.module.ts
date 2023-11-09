import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotController } from "./tax-lot.controller";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaxLot] })],
  exports: [TaxLotService],
  providers: [TaxLotService],
  controllers: [TaxLotController],
})
export class TaxLotModule {}
