import { Inject, Injectable } from "@nestjs/common";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  FindCapitalProjectsByCityCouncilIdPathParams,
  FindCapitalProjectsByCityCouncilIdQueryParams,
  FindCapitalProjectsByCityCouncilIdQueryResponse,
  FindCapitalProjectTilesByCityCouncilDistrictIdPathParams,
  FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams,
  FindCityCouncilDistrictTilesPathParams,
} from "src/gen";
import { produce } from "immer";
import { CityCouncilDistrictGeoJsonEntity } from "./city-council-district.repository.schema";
import { CityCouncilDistrictEntity } from "src/schema";
import { MultiPolygon } from "geojson";

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
      order: "id",
    };
  }

  async findTiles(params: FindCityCouncilDistrictTilesPathParams) {
    return await this.cityCouncilDistrictRepository.findTiles(params);
  }

  async findGeoJsonById({
    cityCouncilDistrictId,
  }: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams) {
    const cityCouncilDistrictGeoJson =
      await this.cityCouncilDistrictRepository.findGeoJsonById({
        cityCouncilDistrictId,
      });
    if (cityCouncilDistrictGeoJson === undefined)
      throw new ResourceNotFoundException();

    const geometry = JSON.parse(
      cityCouncilDistrictGeoJson.geometry,
    ) as MultiPolygon;
    const properties = produce(
      cityCouncilDistrictGeoJson as Partial<CityCouncilDistrictGeoJsonEntity>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as CityCouncilDistrictEntity;

    return {
      type: "Feature",
      id: cityCouncilDistrictGeoJson.id,
      properties,
      geometry,
    };
  }

  async findCapitalProjectTilesByCityCouncilDistrictId(
    params: FindCapitalProjectTilesByCityCouncilDistrictIdPathParams,
  ) {
    return this.cityCouncilDistrictRepository.findCapitalProjectTilesByCityCouncilDistrictId(
      params,
    );
  }

  async findCapitalProjectsById({
    limit = 20,
    offset = 0,
    managingAgency = "",
    cityCouncilDistrictId,
  }: FindCapitalProjectsByCityCouncilIdPathParams &
    FindCapitalProjectsByCityCouncilIdQueryParams): Promise<FindCapitalProjectsByCityCouncilIdQueryResponse> {
    const cityCouncilDistrictCheck =
      await this.cityCouncilDistrictRepository.checkCityCouncilDistrictById(
        cityCouncilDistrictId,
      );

    if (cityCouncilDistrictCheck === undefined)
      throw new ResourceNotFoundException();
    console.log("managing agency in service", managingAgency);
    console.log("limit", limit);
    const capitalProjects =
      await this.cityCouncilDistrictRepository.findCapitalProjectsById({
        limit,
        offset,
        managingAgency,
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
