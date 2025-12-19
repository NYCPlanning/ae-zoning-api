import {
  findGeoJsonByIdRepoSchema,
  FindManyRepo,
  CheckByIdRepo,
} from "src/city-council-district/city-council-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams } from "src/gen";
import { cityCouncilDistrictEntitySchema } from "src/schema";
import { generateMockMvt } from "test/utils";

export class CityCouncilDistrictRepositoryMock {
  districts = Array.from(Array(2), (_, index) =>
    generateMock(cityCouncilDistrictEntitySchema, { seed: index + 1 }),
  );

  async findMany(): Promise<FindManyRepo> {
    return this.districts;
  }

  findTilesMock = generateMockMvt();

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

  findGeoJsonByIdMocks = Array.from(Array(2), (_, seed) =>
    generateMock(findGeoJsonByIdRepoSchema, { seed: seed + 1 }),
  );

  async findGeoJsonById({
    cityCouncilDistrictId,
  }: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams) {
    return this.findGeoJsonByIdMocks.find(
      (row) => row.id === cityCouncilDistrictId,
    );
  }

  async checkById(id: string): Promise<CheckByIdRepo> {
    return this.districts.some((row) => row.id === id);
  }

  findCapitalProjectTilesByCityCouncilDistrictIdMock = generateMockMvt();

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

  findCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdMock =
    generateMockMvt();

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
  async findCommunityBoardBudgetRequestTilesByCityCouncilDistrictId() {
    return this.findCommunityBoardBudgetRequestTilesByCityCouncilDistrictIdMock;
  }
}
