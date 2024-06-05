import { generateMock } from "@anatine/zod-mock";
import { findTilesRepoSchema } from "src/capital-project/capital-project.repository.schema";

export class CapitalProjectRepositoryMock {
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
