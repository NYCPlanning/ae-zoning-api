import { Inject, Injectable } from "@nestjs/common";
import { BoroughRepository } from "./borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams,
} from "src/gen";

@Injectable()
export class BoroughService {
  constructor(
    @Inject(BoroughRepository)
    private readonly boroughRepository: BoroughRepository,
    @Inject(CommunityDistrictRepository)
    private readonly communityDistrictRepository: CommunityDistrictRepository,
  ) {}

  async findMany() {
    const boroughs = await this.boroughRepository.findMany();
    return {
      boroughs,
    };
  }

  async findCommunityDistrictsByBoroughId(id: string) {
    const boroughCheck = await this.boroughRepository.checkBoroughById(id);
    if (boroughCheck === undefined) throw new ResourceNotFoundException();

    const communityDistricts =
      await this.boroughRepository.findCommunityDistrictsByBoroughId(id);

    return {
      communityDistricts,
    };
  }

  async findCapitalProjectsByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
    limit = 20,
    offset = 0,
  }: FindCapitalProjectsByBoroughIdCommunityDistrictIdPathParams &
    FindCapitalProjectsByBoroughIdCommunityDistrictIdQueryParams) {
    const boroughCheck =
      await this.boroughRepository.checkBoroughById(boroughId);
    if (boroughCheck === undefined) throw new ResourceNotFoundException();

    const communityDistrictCheck =
      await this.communityDistrictRepository.checkCommunityDistrictById(
        communityDistrictId,
      );
    if (communityDistrictCheck === undefined)
      throw new ResourceNotFoundException();

    const capitalProjects =
      await this.boroughRepository.findCapitalProjectsByBoroughIdCommunityDistrictId(
        {
          boroughId,
          communityDistrictId,
          limit,
          offset,
        },
      );

    return {
      limit,
      offset,
      total: capitalProjects.length,
      order: "managingCode, capitalProjectId",
      capitalProjects,
    };
  }
}
