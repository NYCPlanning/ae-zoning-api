import { Module } from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotController } from "./tax-lot.controller";
import { TaxLotRepo } from "./tax-lot.repo";

@Module({
  exports: [TaxLotService],
  providers: [TaxLotService, TaxLotRepo],
  controllers: [TaxLotController],
})
export class TaxLotModule {}
