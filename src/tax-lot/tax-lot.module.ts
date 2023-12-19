import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotController } from "./tax-lot.controller";
import { TaxLotRepo } from "./tax-lot.repo";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [TaxLot] })],
  exports: [TaxLotService],
  providers: [TaxLotService, TaxLotRepo],
  controllers: [TaxLotController],
})
export class TaxLotModule {}
