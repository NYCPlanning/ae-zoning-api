import { Inject, Injectable } from "@nestjs/common";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";

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
}
