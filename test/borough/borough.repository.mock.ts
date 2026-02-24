import {
  findCommunityDistrictsByBoroughIdRepoSchema,
  communityDistrictGeoJsonEntitySchema,
  CheckByIdRepo,
  CheckByIdsRepo,
} from "src/borough/borough.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams } from "src/gen";
import { boroughEntitySchema } from "src/schema";
import { generateMockMvt } from "test/utils";

export class BoroughRepositoryMock {
  boroughs = Array.from(Array(1), (_, index) =>
    generateMock(boroughEntitySchema, { seed: index + 1 }),
  );

  async checkById(id: string): Promise<CheckByIdRepo> {
    return this.boroughs.some((row) => row.id === id);
  }

  async checkByIds(ids: Array<string>): Promise<CheckByIdsRepo> {
    const boroughIds = this.boroughs.map((borough) => borough.id);
    return ids.every((id) => boroughIds.includes(id));
  }

  async findMany() {
    return this.boroughs;
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

  findCommunityDistrictsByBoroughIdMocks = this.boroughs.map((borough) => {
    return {
      [borough.id]: generateMock(findCommunityDistrictsByBoroughIdRepoSchema),
    };
  });

  async findCommunityDistrictsByBoroughId(id: string) {
    const results = this.findCommunityDistrictsByBoroughIdMocks.find(
      (communityDistricts) => id in communityDistricts,
    );

    return results === undefined ? [] : results[id];
  }

  findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks = Array.from(
    Array(1),
    (_, index) =>
      generateMock(communityDistrictGeoJsonEntitySchema, { seed: index + 1 }),
  );

  async findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
  }: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams) {
    return this.findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks.find(
      (row) => row.id === communityDistrictId && row.boroughId === boroughId,
    );
  }

  findCapitalProjectTilesByBoroughIdCommunityDistrictIdMock = generateMockMvt();
  findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdMock =
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
  async findCapitalProjectTilesByBoroughIdCommunityDistrictId() {
    return this.findCapitalProjectTilesByBoroughIdCommunityDistrictIdMock;
  }

  async findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId() {
    return this
      .findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdMock;
  }
}
