import { Module } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";
import { BoroughRepository } from "./borough.repository";

@Module({
  exports: [BoroughService],
  providers: [BoroughService, BoroughRepository],
  controllers: [BoroughController],
})
export class BoroughModule {}
