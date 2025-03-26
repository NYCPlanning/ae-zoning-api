import { Module } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";
import { BoroughRepository } from "./borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { CapitalProjectModule } from "src/capital-project/capital-project.module";

@Module({
  exports: [BoroughService],
  providers: [BoroughService, BoroughRepository, CommunityDistrictRepository],
  controllers: [BoroughController],
  imports: [CapitalProjectModule],
})
export class BoroughModule {}
