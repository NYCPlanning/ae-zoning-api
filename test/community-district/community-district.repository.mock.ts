import { generateMock } from "@anatine/zod-mock";
import {
  findTilesRepoSchema,
  checkByCommunityDistrictIdRepoSchema,
} from "src/community-district/community-district.repository.schema";

export class CommunityDistrictRepositoryMock {
  numberOfMocks = 1;

  checkCommunityDistrictByIdMocks = Array.from(
    Array(this.numberOfMocks),
    (_, seed) =>
      generateMock(checkByCommunityDistrictIdRepoSchema, { seed: seed + 1 }),
  );

  async checkCommunityDistrictById(id: string) {
    return this.checkCommunityDistrictByIdMocks.find((row) => row.id === id);
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
