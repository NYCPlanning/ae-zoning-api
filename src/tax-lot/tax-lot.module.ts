import { Module } from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotController } from "./tax-lot.controller";
import { TaxLotRepository } from "./tax-lot.repository";
import { StorageConfig } from "src/config";
import { ConfigModule } from "@nestjs/config";

@Module({
  exports: [TaxLotService],
  providers: [TaxLotService, TaxLotRepository, {
    provide: StorageConfig.KEY,
    useValue: StorageConfig.KEY
  }],
  controllers: [TaxLotController],
})
export class TaxLotModule {}