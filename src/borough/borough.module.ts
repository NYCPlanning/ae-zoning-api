import { Module } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";
import { BoroughRepo } from "./borough.repo";

@Module({
  exports: [BoroughService],
  providers: [BoroughService, BoroughRepo],
  controllers: [BoroughController],
})
export class BoroughModule {}
