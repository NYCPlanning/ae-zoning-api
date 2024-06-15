import { Inject, Injectable } from "@nestjs/common";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import { FindCityCouncilDistrictTilesPathParams } from "src/gen";

@Injectable()
export class CityCouncilDistrictService {
  constructor(
    @Inject(CityCouncilDistrictRepository)
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
  ) {}

  async findMany() {
    const cityCouncilDistricts =
      await this.cityCouncilDistrictRepository.findMany();

    return {
      cityCouncilDistricts,
    };
  }

  async findTiles(params: FindCityCouncilDistrictTilesPathParams) {
    return await this.cityCouncilDistrictRepository.findTiles(params);
  }
}
