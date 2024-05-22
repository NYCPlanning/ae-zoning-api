import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { CommunityDistrictRepository } from "./community-district.repository";

@Injectable()
export class CommunityDistrictService {
  constructor(
    @Inject(CommunityDistrictRepository)
    private readonly communityDistrictRepository: CommunityDistrictRepository,
  ) {}

  async findCommunityDistrictsByBoroughId(id: string) {
    const communityDistricts = await this.communityDistrictRepository.findCommunityDistrictsByBoroughId(id);
    if (communityDistricts === undefined) throw new ResourceNotFoundException();

    return communityDistricts;
  }

  // async findCommunityDistrictClassesById(id: string) {
  //   const communityDistrictCheck =
  //     await this.communityDistrictRepository.checkById(id);
  //   if (communityDistrictCheck === undefined)
  //     throw new ResourceNotFoundException();
  //   const communityDistrictClasses =
  //     await this.communityDistrictRepository.findCommunityDistrictClassesById(id);

  //   return {
  //     communityDistrictClasses,
  //   };
  // }
}
