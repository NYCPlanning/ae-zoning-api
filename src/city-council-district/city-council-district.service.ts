import { Inject, Injectable } from "@nestjs/common";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  FindCapitalProjectsByCityCouncilIdPathParams,
  FindCapitalProjectsByCityCouncilIdQueryParams,
  FindCapitalProjectsByCityCouncilIdQueryResponse,
  FindCityCouncilDistrictTilesPathParams,
} from "src/gen";

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

  async findCapitalProjectsById({
    limit = 20,
    offset = 0,
    cityCouncilDistrictId,
  }: FindCapitalProjectsByCityCouncilIdPathParams &
    FindCapitalProjectsByCityCouncilIdQueryParams): Promise<FindCapitalProjectsByCityCouncilIdQueryResponse> {
    const cityCouncilDistrictCheck =
      await this.cityCouncilDistrictRepository.checkCityCouncilDistrictById(
        cityCouncilDistrictId,
      );

    if (cityCouncilDistrictCheck === undefined)
      throw new ResourceNotFoundException();

    const capitalProjects =
      await this.cityCouncilDistrictRepository.findCapitalProjectsById({
        limit,
        offset,
        cityCouncilDistrictId,
      });

    return {
      limit,
      offset,
      total: capitalProjects.length,
      order: "managingCode, capitalProjectId",
      capitalProjects,
    };
  }
}
