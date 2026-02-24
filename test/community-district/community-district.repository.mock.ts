import { generateMock } from "@anatine/zod-mock";
import { CheckByBoroughIdCommunityDistrictIdRepo } from "src/community-district/community-district.repository.schema";
import { communityDistrictEntitySchema } from "src/schema";
import { generateMockMvt } from "test/utils";

export class CommunityDistrictRepositoryMock {
  // community districts would preferably share their borough ids with the borough repository mock
  // the way the mock classes are initialized, it is not able to reference the borough repository
  // later in the capital project filtering criteria, we have separate boroughId and boroughIds criteria each relying on a different repository
  districts = Array.from(Array(2), (_, index) =>
    generateMock(communityDistrictEntitySchema, { seed: index + 1 }),
  );

  async checkByBoroughIdCommunityDistrictId(
    boroughId: string,
    id: string,
  ): Promise<CheckByBoroughIdCommunityDistrictIdRepo> {
    return this.districts.some(
      (row) => row.boroughId === boroughId && row.id === id,
    );
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
}
