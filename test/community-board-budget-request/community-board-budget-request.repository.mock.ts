import { generateMock } from "@anatine/zod-mock";
import {
  CheckNeedGroupByIdRepo,
  CheckPolicyAreaByIdRepo,
  FindAgenciesRepo,
  FindCommunityBoardBudgetRequestByIdRepo,
  findCommunityBoardBudgetRequestByIdRepoSchema,
  FindNeedGroupsRepo,
  FindPolicyAreasRepo,
} from "src/community-board-budget-request/community-board-budget-request.repository.schema";
import {
  CbbrNeedGroupEntitySchema,
  cbbrNeedGroupEntitySchema,
  CbbrPolicyAreaEntitySchema,
  cbbrPolicyAreaEntitySchema,
  AgencyEntitySchema,
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

  cbbrMocks = generateMock(findCommunityBoardBudgetRequestByIdRepoSchema, {
    seed: 1,
  });

  checkNeedGroupById(id: number): CheckNeedGroupByIdRepo {
    return this.needGroupMocks.some((needGroup) => needGroup.id === id);
  }

  checkPolicyAreaById(id: number): CheckPolicyAreaByIdRepo {
    return this.policyAreaMocks.some((policyArea) => policyArea.id === id);
  }

  get agenciesCriteria(): Array<
    [
      {
        needGroupId: number;
        policyAreaId: number;
      },
      AgencyEntitySchema,
    ]
  > {
    const agencyMocks = this.agencyRepoMock.agencies;
    return agencyMocks.map((mockAgency, i) => {
      return [
        {
          needGroupId: this.needGroupMocks[i].id,
          policyAreaId: this.policyAreaMocks[i].id,
        },
        mockAgency,
      ];
    });
  }

  get needGroupsCriteria(): Array<
    [
      {
        agencyInitials: string;
        policyAreaId: number;
      },
      CbbrNeedGroupEntitySchema,
    ]
  > {
    const agencyMocks = this.agencyRepoMock.agencies;
    return this.needGroupMocks.map((mockNeedGroup, i) => {
      return [
        {
          agencyInitials: agencyMocks[i % 2].initials,
          policyAreaId: this.policyAreaMocks[i].id,
        },
        mockNeedGroup,
      ];
    });
  }

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

  async findAgencies({
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
  }: {
    cbbrPolicyAreaId?: number;
    cbbrNeedGroupId?: number;
  }): Promise<FindAgenciesRepo> {
    return this.agenciesCriteria
      .filter(([criteria, _]) => {
        if (
          cbbrPolicyAreaId !== undefined &&
          cbbrPolicyAreaId !== criteria.policyAreaId
        )
          return false;
        if (
          cbbrNeedGroupId !== undefined &&
          cbbrNeedGroupId !== criteria.needGroupId
        )
          return false;
        return true;
      })
      .map(([_, agency]) => agency);
  }

  async findNeedGroups({
    cbbrPolicyAreaId,
    agencyInitials,
  }: {
    cbbrPolicyAreaId?: number;
    agencyInitials?: string;
  }): Promise<FindNeedGroupsRepo> {
    return this.needGroupsCriteria
      .filter(([criteria, _]) => {
        if (
          cbbrPolicyAreaId !== undefined &&
          cbbrPolicyAreaId !== criteria.policyAreaId
        )
          return false;
        if (
          agencyInitials !== undefined &&
          agencyInitials !== criteria.agencyInitials
        )
          return false;
        return true;
      })
      .map(([_, needGroup]) => needGroup);
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

  async findById({
    cbbrId,
  }: {
    cbbrId: string;
  }): Promise<FindCommunityBoardBudgetRequestByIdRepo> {
    const cbbr = this.cbbrMocks.find((cbbr) => cbbr.id === cbbrId);
    return cbbr === undefined ? [] : [cbbr];
  }
}
