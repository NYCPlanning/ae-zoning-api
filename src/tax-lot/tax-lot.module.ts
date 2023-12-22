import { Module } from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotController } from "./tax-lot.controller";
import { TaxLotRepository } from "./tax-lot.repository";

@Module({
  exports: [TaxLotService],
  providers: [TaxLotService, TaxLotRepository],
  controllers: [TaxLotController],
})
export class TaxLotModule {}
