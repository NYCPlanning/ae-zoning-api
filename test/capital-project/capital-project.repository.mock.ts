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
import { capitalProject, managingCode } from "src/schema";
// import { capitalCommitment } from "src/schema";
export class CapitalProjectRepositoryMock {
  numberOfMocks = 1;

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

  /*
    capitalProjectMock {
      managingCode: '158',
      id: 'modi',
      managingAgency: 'modi',
      description: 'modi',
      minDate: '2018-01-01',
      maxDate: '2045-12-31',
      category: 'Fixed Asset',
      sponsoringAgencies: [ 'modi' ],
      budgetTypes: [ 'modi' ],
      commitmentsTotal: 1210245525274624
    }
  */

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

  findCapitalCommitmentsByManagingCodeCapitalProjectIdMocks = 
  generateMock(
    findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
  );

  async findCapitalCommitmentsByManagingCodeCapitalProjectIdMocksTWO({
    managingCode,
    capitalProjectId,
  }: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams) {
    this.findByManagingCodeCapitalProjectIdMock.filter(
      (capitalProject) => { 
        if (capitalProject.id === capitalProjectId && capitalProject.managingCode === managingCode) 
          return {
            [`${managingCode}${capitalProjectId}`]: generateMock(findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,)
          }
      }
    );
  } 
  
  async findCapitalCommitmentsByManagingCodeCapitalProjectId({
    managingCode,
    capitalProjectId,
  }: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams): Promise<FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo> {
    return this.findCapitalCommitmentsByManagingCodeCapitalProjectIdMocksTWO.filter(
      (capitalCommitments) =>
        capitalCommitments.id === capitalProjectId &&
        capitalCommitments. === managingCode,
    );
  }
}
