import { generateMock } from "@anatine/zod-mock";
import {
  checkByManagingCodeCapitalProjectIdRepoSchema,
  FindByManagingCodeCapitalProjectIdRepo,
  findByManagingCodeCapitalProjectIdRepoSchema,
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
  findTilesRepoSchema,
} from "src/capital-project/capital-project.repository.schema";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
} from "src/gen";

export class CapitalProjectRepositoryMock {
  checkByManagingCodeCapitalProjectIdMocks = Array.from(Array(5), (_, seed) =>
    generateMock(checkByManagingCodeCapitalProjectIdRepoSchema, {
      seed: seed + 1,
    }),
  );

  async checkByManagingCodeCapitalProjectId(
    managingCode: string,
    capitalProjectId: string,
  ) {
    return this.checkByManagingCodeCapitalProjectIdMocks.find((row) => {
      return row.id === capitalProjectId && row.managingCode === managingCode;
    });
  }

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

  findCapitalCommitmentsByManagingCodeCapitalProjectIdMocks =
    this.checkByManagingCodeCapitalProjectIdMocks.map(
      (checkCapitalCommitment) => {
        return {
          [`${checkCapitalCommitment.managingCode}${checkCapitalCommitment.id}`]:
            generateMock(
              findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
              {
                stringMap: {
                  plannedDate: () => "2045-01-01",
                },
              },
            ),
        };
      },
    );

  async findCapitalCommitmentsByManagingCodeCapitalProjectId({
    managingCode,
    capitalProjectId,
  }: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams): Promise<FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo> {
    const compositeKey = `${managingCode}${capitalProjectId}`;
    const results =
      this.findCapitalCommitmentsByManagingCodeCapitalProjectIdMocks.find(
        (capitalProjectCapitalCommitments) =>
          compositeKey in capitalProjectCapitalCommitments,
      );

    return results === undefined ? [] : results[compositeKey];
  }

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
}
