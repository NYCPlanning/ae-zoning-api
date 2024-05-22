import { Inject, Injectable } from "@nestjs/common";
import { BoroughRepository } from "./borough.repository";
import { ResourceNotFoundException } from "src/exception";

@Injectable()
export class BoroughService {
  constructor(
    @Inject(BoroughRepository)
    private readonly boroughRepository: BoroughRepository,
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
}
