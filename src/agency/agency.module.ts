import { Module } from "@nestjs/common";
import { AgencyService } from "./agency.service";
import { AgencyController } from "./agency.controller";
import { AgencyRepository } from "./agency.repository";

@Module({
  exports: [AgencyService],
  providers: [AgencyService, AgencyRepository],
  controllers: [AgencyController],
})
export class AgencyModule {}
