import { Injectable } from "@nestjs/common";
import { FacilityRepository } from "./facility.repository";
import { FindFacilityByIdPathParams } from "src/gen";
import { ResourceNotFoundException } from "src/exception";

@Injectable()
export class FacilityService {
  constructor(private readonly facilityRepository: FacilityRepository) {}

  async findById({ facilityId }: FindFacilityByIdPathParams) {
    const facility = await this.facilityRepository.findById({ facilityId });

    if (facility === undefined) {
      throw new ResourceNotFoundException("Cannot find Facility");
    }

    return facility;
  }

  async findCategories() {
    return await this.facilityRepository.findCategories();
  }
}
