import { Inject } from "@nestjs/common";
import { CommunityDistrictRepository } from "./community-district.repository";
import { FindCommunityDistrictTilesPathParams } from "src/gen";

export class CommunityDistrictService {
  constructor(
    @Inject(CommunityDistrictRepository)
    private readonly communityDistrictRepository: CommunityDistrictRepository,
  ) {}

  async findTiles(params: FindCommunityDistrictTilesPathParams) {
    return await this.communityDistrictRepository.findTiles(params);
  }
}
