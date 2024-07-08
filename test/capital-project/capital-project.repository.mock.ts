import { generateMock } from "@anatine/zod-mock";
import {
  FindByManagingCodeCapitalProjectIdRepo,
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo,
  findByManagingCodeCapitalProjectIdRepoSchema,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
  findTilesRepoSchema,
} from "src/capital-project/capital-project.repository.schema";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
} from "src/gen";
import { capitalCommitment } from "src/schema";
export class CapitalProjectRepositoryMock {
  findByManagingCodeCapitalProjectIdMock = generateMock(
    findByManagingCodeCapitalProjectIdRepoSchema,
    {
      seed: 1,
      stringMap: {
        minDate: () => "2018-01-01",
        maxDate: () => "2045-12-31",
      },
    },
  );

  async findByManagingCodeCapitalProjectId({
    managingCode,
    capitalProjectId,
  }: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams): Promise<FindByManagingCodeCapitalProjectIdRepo> {
    return this.findByManagingCodeCapitalProjectIdMock.filter(
      (capitalProject) =>
        capitalProject.id === capitalProjectId &&
        capitalProject.managingCode === managingCode,
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

  findCapitalCommitmentsByManagingCodeCapitalProjectIdMocks = generateMock(
    findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
  );

  async findCapitalCommitmentsByManagingCodeCapitalProjectId({
    managingCode,
    capitalProjectId,
  }: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams): Promise<FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo> {
    return this.findCapitalCommitmentsByManagingCodeCapitalProjectIdMocks.filter(
      (capitalCommitments) =>
        capitalCommitments.id === capitalProjectId &&
        capitalCommitment.managingCode === managingCode,
    );
  }
}
