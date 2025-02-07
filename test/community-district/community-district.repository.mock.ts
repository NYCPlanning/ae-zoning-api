import { generateMock } from "@anatine/zod-mock";
import {
  findTilesRepoSchema,
  checkByBoroughIdCommunityDistrictIdRepoSchema,
} from "src/community-district/community-district.repository.schema";

export class CommunityDistrictRepositoryMock {
  numberOfMocks = 1;

  checkByBoroughIdCommunityDistrictIdMocks = Array.from(
    Array(this.numberOfMocks),
    (_, seed) =>
      generateMock(checkByBoroughIdCommunityDistrictIdRepoSchema, {
        seed: seed + 1,
      }),
  );

  async checkByBoroughIdCommunityDistrictId(boroughId: string, id: string) {
    return this.checkByBoroughIdCommunityDistrictIdMocks.find(
      (row) => row.boroughId === boroughId && row.id === id,
    );
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
}
