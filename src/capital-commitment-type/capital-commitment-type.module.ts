import { Module } from "@nestjs/common";
import { CapitalCommitmentTypeRepository } from "./capital-commitment-type.repository";
import { CapitalCommitmentTypeService } from "./capital-commitment.service";
import { CapitalCommitmentTypeController } from "./capital-commitment-type.controller";

@Module({
  exports: [CapitalCommitmentTypeService],
  providers: [CapitalCommitmentTypeService, CapitalCommitmentTypeRepository],
  controllers: [CapitalCommitmentTypeController],
})
export class CapitalCommitmentTypeModule {}
