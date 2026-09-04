import { Injectable } from "@nestjs/common";
import { HousingGrowthRepository } from "./housing-growth.repository";
import {
  FindHousingGrowthByBoroughTilesPathParams,
  FindHousingGrowthByCommunityDistrictTilesPathParams,
  FindHousingGrowthByNeighborhoodTabulationAreaTilesPathParams,
} from "src/gen";

@Injectable()
export class HousingGrowthService {
  constructor(
    private readonly housingGrowthRepository: HousingGrowthRepository,
  ) {}

  async findBoroughsTiles(params: FindHousingGrowthByBoroughTilesPathParams) {
    return await this.housingGrowthRepository.findBoroughsTiles(params);
  }

  async findCommunityDistrictsTiles(
    params: FindHousingGrowthByCommunityDistrictTilesPathParams,
  ) {
    return await this.housingGrowthRepository.findCommunityDistrictsTiles(
      params,
    );
  }

  async findNeighborhoodTabulationAreasTiles(
    params: FindHousingGrowthByNeighborhoodTabulationAreaTilesPathParams,
  ) {
    return await this.housingGrowthRepository.findNeighborhoodTabulationAreasTiles(
      params,
    );
  }
}
