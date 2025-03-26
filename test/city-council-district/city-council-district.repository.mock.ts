import {
  findManyRepoSchema,
  findTilesRepoSchema,
  checkByIdRepoSchema,
  findCapitalProjectsByCityCouncilDistrictIdRepoSchema,
  findGeoJsonByIdRepoSchema,
  findCapitalProjectTilesByCityCouncilDistrictIdRepoSchema,
} from "src/city-council-district/city-council-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams } from "src/gen";

export class CityCouncilDistrictRepositoryMock {
  numberOfMocks = 2;

  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }

  findTilesMock = generateMock(findTilesRepoSchema);

  /**
   * The database will always return tiles,
   * even when the view is outside the extents.
   * These would merely be empty tiles.
   *
   * To reflect this behavior in the mock,
   * we disregard any viewport parameters and
   * always return something.
   *
   * This applies to all mvt-related mocks
   */

  async findTiles() {
    return this.findTilesMock;
  }

  findGeoJsonByIdMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(findGeoJsonByIdRepoSchema, { seed: seed + 1 }),
  );

  async findGeoJsonById({
    cityCouncilDistrictId,
  }: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams) {
    return this.findGeoJsonByIdMocks.find(
      (row) => row.id === cityCouncilDistrictId,
    );
  }

  checkCityCouncilDistrictByIdMocks = Array.from(
    Array(this.numberOfMocks),
    (_, seed) => generateMock(checkByIdRepoSchema, { seed: seed + 1 }),
  );

  async checkCityCouncilDistrictById(id: string) {
    return this.checkCityCouncilDistrictByIdMocks.find((row) => row.id === id);
  }

  findCapitalProjectsByIdMocks = this.checkCityCouncilDistrictByIdMocks.map(
    (checkCityCouncilDistrict) => {
      return {
        [checkCityCouncilDistrict.id]: generateMock(
          findCapitalProjectsByCityCouncilDistrictIdRepoSchema,
          {
            stringMap: {
              minDate: () => "2018-01-01",
              maxDate: () => "2045-12-31",
            },
          },
        ),
      };
    },
  );

  findCapitalProjectTilesByCityCouncilDistrictIdMock = generateMock(
    findCapitalProjectTilesByCityCouncilDistrictIdRepoSchema,
  );

  /**
   * The database will always return tiles,
   * even when the view is outside the extents.
   * These would merely be empty tiles.
   *
   * To reflect this behavior in the mock,
   * we disregard any viewport parameters and
   * always return something.
   *
   * This applies to all mvt-related mocks
   */
  async findCapitalProjectTilesByCityCouncilDistrictId() {
    return this.findCapitalProjectTilesByCityCouncilDistrictIdMock;
  }
}
