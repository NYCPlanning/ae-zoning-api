import { generateMock } from "@anatine/zod-mock";
import { FindPolicyAreasRepo } from "src/community-board-budget-request/community-board-budget-request.repository.schema";
import {
  cbbrNeedGroupEntitySchema,
  CbbrPolicyAreaEntitySchema,
  cbbrPolicyAreaEntitySchema,
} from "src/schema";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";

export class CommunityBoardBudgetRequestRepositoryMock {
  agencyRepoMock: AgencyRepositoryMock;
  constructor(agencyRepoMock: AgencyRepositoryMock) {
    this.agencyRepoMock = agencyRepoMock;
  }

  policyAreaMocks = Array.from(Array(8), (_, i) =>
    generateMock(cbbrPolicyAreaEntitySchema, { seed: i + 1 }),
  );

  needGroupMocks = Array.from(Array(8), (_, i) =>
    generateMock(cbbrNeedGroupEntitySchema, { seed: i + 1 }),
  );

  get policyAreasCriteria(): Array<
    [
      {
        agencyInitials: string;
        needGroupId: number;
      },
      CbbrPolicyAreaEntitySchema,
    ]
  > {
    const agencyMocks = this.agencyRepoMock.agencies;
    return this.policyAreaMocks.map((mockPolicyArea, i) => {
      return [
        {
          agencyInitials: agencyMocks[i % 2].initials,
          needGroupId: this.needGroupMocks[i].id,
        },
        mockPolicyArea,
      ];
    });
  }

  async findPolicyAreas({
    cbbrNeedGroupId,
    agencyInitials,
  }: {
    cbbrNeedGroupId?: number;
    agencyInitials?: string;
  }): Promise<FindPolicyAreasRepo> {
    return this.policyAreasCriteria
      .filter(([criteria, _]) => {
        if (
          cbbrNeedGroupId !== undefined &&
          cbbrNeedGroupId !== criteria.needGroupId
        )
          return false;
        if (
          agencyInitials !== undefined &&
          agencyInitials !== criteria.agencyInitials
        )
          return false;
        return true;
      })
      .map(([_, policyArea]) => policyArea);
  }
}
