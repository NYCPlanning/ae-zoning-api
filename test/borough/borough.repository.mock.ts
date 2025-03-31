import {
  findManyRepoSchema,
  findCommunityDistrictsByBoroughIdRepoSchema,
  communityDistrictGeoJsonEntitySchema,
  findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema,
} from "src/borough/borough.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams } from "src/gen";

export class BoroughRepositoryMock {
  communityDistrictRepoMock: CommunityDistrictRepositoryMock;
  constructor(communityDistrictRepoMock: CommunityDistrictRepositoryMock) {
    this.communityDistrictRepoMock = communityDistrictRepoMock;
  }

  findManyMocks = generateMock(findManyRepoSchema);

  async checkBoroughById(id: string) {
    const result = this.findManyMocks.some((row) => row.id === id);
    console.debug("the result yo", result);
    return result;
  }

  async findMany() {
    return this.findManyMocks;
  }

  findCommunityDistrictsByBoroughIdMocks = this.findManyMocks.map((borough) => {
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
    (_, seed) =>
      generateMock(communityDistrictGeoJsonEntitySchema, { seed: seed + 1 }),
  );

  async findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
  }: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams) {
    return this.findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks.find(
      (row) => row.id === communityDistrictId && row.boroughId === boroughId,
    );
  }

  findCapitalProjectTilesByBoroughIdCommunityDistrictIdMock = generateMock(
    findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema,
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
  async findCapitalProjectTilesByBoroughIdCommunityDistrictId() {
    return this.findCapitalProjectTilesByBoroughIdCommunityDistrictIdMock;
  }
}
