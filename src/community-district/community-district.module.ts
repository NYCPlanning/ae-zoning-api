import { Module } from "@nestjs/common";
import { CommunityDistrictController } from "./community-district.controller";
import { CommunityDistrictService } from "./community-district.service";
import { CommunityDistrictRepository } from "./community-district.repository";

@Module({
  exports: [CommunityDistrictService, CommunityDistrictRepository],
  providers: [CommunityDistrictService, CommunityDistrictRepository],
  controllers: [CommunityDistrictController],
})
export class CommunityDistrictModule {}
