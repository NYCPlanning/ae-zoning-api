import { Module } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";
import { BoroughRepository } from "./borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";

@Module({
  exports: [BoroughService],
  providers: [BoroughService, BoroughRepository, CommunityDistrictRepository],
  controllers: [BoroughController],
})
export class BoroughModule {}
