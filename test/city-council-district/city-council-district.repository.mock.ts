import {
  findManyRepoSchema,
  findTilesRepoSchema,
  checkByIdRepoSchema,
  findCapitalProjectsByCityCouncilDistrictIdRepoSchema,
} from "src/city-council-district/city-council-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class CityCouncilDistrictRepositoryMock {
  numberOfMocks = 1;

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

  async findCapitalProjectsById({
    limit,
    offset,
    cityCouncilDistrictId,
  }: {
    limit: number;
    offset: number;
    cityCouncilDistrictId: string;
  }) {
    const results = this.findCapitalProjectsByIdMocks.find((ccdIdToCps) => {
      return cityCouncilDistrictId in ccdIdToCps;
    });

    const capitalProjects =
      results === undefined ? [] : results[cityCouncilDistrictId];

    return capitalProjects.slice(offset, limit + offset);
  }
}
