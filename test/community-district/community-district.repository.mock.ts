import { generateMock } from "@anatine/zod-mock";
import { findTilesRepoSchema } from "src/community-district/community-district.repository.schema";
import { communityDistrictEntitySchema } from "src/schema/community-district";
import { z } from "zod";

export class CommunityDistrictRepositoryMock {
  communityDistrictMocks = generateMock(z.array(communityDistrictEntitySchema));

  async checkByBoroughIdCommunityDistrictId(boroughId: string, id: string) {
    return this.communityDistrictMocks.some(
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
