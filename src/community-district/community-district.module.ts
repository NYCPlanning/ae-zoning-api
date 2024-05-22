import { Module } from "@nestjs/common";
import { CommunityDistrictService } from "./community-district.service";
import { CommunityDistrictController } from "./community-district.controller";
import { CommunityDistrictRepository } from "./community-district.repository";

@Module({
  exports: [CommunityDistrictService],
  providers: [CommunityDistrictService, CommunityDistrictRepository],
  controllers: [CommunityDistrictController],
})
export class CommunityDistrictModule {}
