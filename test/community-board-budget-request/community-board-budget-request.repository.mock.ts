import { generateMock } from "@anatine/zod-mock";
import {
  CheckNeedGroupByIdRepo,
  CheckPolicyAreaByIdRepo,
  FindAgenciesRepo,
  FindCommunityBoardBudgetRequestByIdRepo,
  findCommunityBoardBudgetRequestByIdRepoSchema,
  FindManyCommunityBoardBudgetRequestRepo,
  FindNeedGroupsRepo,
  FindPolicyAreasRepo,
  FindCountCommunityBoardBudgetRequestRepo,
  CheckAgencyResponseTypeByIdRepo,
  findManyCommunityBoardBudgetRequestEntitySchema,
  FindManyCommunityBoardBudgetRequestEntity,
} from "src/community-board-budget-request/community-board-budget-request.repository.schema";
import {
  CbbrNeedGroupEntitySchema,
  cbbrNeedGroupEntitySchema,
  CbbrPolicyAreaEntitySchema,
  cbbrPolicyAreaEntitySchema,
  AgencyEntitySchema,
  cbbrAgencyCategoryResponseEntitySchema,
} from "src/schema";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";

export class CommunityBoardBudgetRequestRepositoryMock {
  agencyRepoMock: AgencyRepositoryMock;
  cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock;
  communityDistrictRepoMock: CommunityDistrictRepositoryMock;

  constructor(
    agencyRepoMock: AgencyRepositoryMock,
    cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock,
    communityDistrictRepoMock: CommunityDistrictRepositoryMock,
  ) {
    this.agencyRepoMock = agencyRepoMock;
    this.cityCouncilDistrictRepoMock = cityCouncilDistrictRepoMock;
    this.communityDistrictRepoMock = communityDistrictRepoMock;
  }

  policyAreaMocks = Array.from(Array(8), (_, i) =>
    generateMock(cbbrPolicyAreaEntitySchema, { seed: i + 1 }),
  );

  checkPolicyAreaById(id: number): CheckPolicyAreaByIdRepo {
    return this.policyAreaMocks.some((policyArea) => policyArea.id === id);
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

  needGroupMocks = Array.from(Array(8), (_, i) =>
    generateMock(cbbrNeedGroupEntitySchema, { seed: i + 1 }),
  );

  checkNeedGroupById(id: number): CheckNeedGroupByIdRepo {
    return this.needGroupMocks.some((needGroup) => needGroup.id === id);
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

  agencyCategoryResponseMocks = Array.from(Array(8), (_, i) =>
    generateMock(cbbrAgencyCategoryResponseEntitySchema, { seed: i + 1 }),
  );

  checkAgencyResponseTypeById(id: number): CheckAgencyResponseTypeByIdRepo {
    return this.agencyCategoryResponseMocks.some(
      (categoryResponse) => categoryResponse.id === id,
    );
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

  findByIdMocks = generateMock(findCommunityBoardBudgetRequestByIdRepoSchema, {
    seed: 1,
  });

  async findById({
    cbbrId,
  }: {
    cbbrId: string;
  }): Promise<FindCommunityBoardBudgetRequestByIdRepo> {
    const cbbr = this.findByIdMocks.find((cbbr) => cbbr.id === cbbrId);
    return cbbr === undefined ? [] : [cbbr];
  }

  findManyMocks = Array.from(Array(8), (_, i) =>
    generateMock(findManyCommunityBoardBudgetRequestEntitySchema, {
      seed: i + 1,
    }),
  );

  get findManyCriteria(): Array<
    [
      {
        boroughId: string;
        communityDistrictId: string;
        cityCouncilDistrictId: string;
        cbbrPolicyAreaId: number;
        cbbrNeedGroupId: number;
        agencyInitials: string;
        cbbrType: "Capital" | "Expense";
        cbbrAgencyResponseTypeId: number;
        isMapped: boolean;
        isContinuedSupport: boolean;
      },
      FindManyCommunityBoardBudgetRequestEntity,
    ]
  > {
    const communityDistricts = this.communityDistrictRepoMock.districts;
    const cityCouncilDistrictRepoMock =
      this.cityCouncilDistrictRepoMock.districts;
    const policyAreas = this.policyAreaMocks;
    const needGroups = this.needGroupMocks;
    const agencies = this.agencyRepoMock.agencies;
    const categoryResponses = this.agencyCategoryResponseMocks;

    return this.findManyMocks.map((mockBudgetRequestResponse, i) => [
      {
        boroughId: communityDistricts[i % 2].boroughId,
        communityDistrictId: communityDistricts[i % 2].id,
        cityCouncilDistrictId: cityCouncilDistrictRepoMock[i % 2].id,
        cbbrPolicyAreaId: policyAreas[i].id,
        cbbrNeedGroupId: needGroups[i].id,
        agencyInitials: agencies[i % 2].initials,
        cbbrType: i % 2 === 0 ? "Capital" : "Expense",
        cbbrAgencyResponseTypeId: categoryResponses[i].id,
        isMapped: i % 3 === 0,
        isContinuedSupport: i % 4 === 0,
      },
      mockBudgetRequestResponse,
    ]);
  }

  async filterCommunityBoardBudgetRequests({
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
    agencyInitials,
    cbbrType,
    cbbrAgencyResponseTypeId,
    isMapped,
    isContinuedSupport,
  }: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: string | null;
    cbbrAgencyResponseTypeId: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
  }): Promise<FindManyCommunityBoardBudgetRequestRepo> {
    return this.findManyCriteria
      .filter(([criteria, _]) => {
        if (
          boroughId !== null &&
          communityDistrictId !== null &&
          (boroughId !== criteria.boroughId ||
            communityDistrictId !== criteria.communityDistrictId)
        )
          return false;

        if (
          cityCouncilDistrictId !== null &&
          criteria.cityCouncilDistrictId !== cityCouncilDistrictId
        )
          return false;

        if (
          cbbrPolicyAreaId !== null &&
          criteria.cbbrPolicyAreaId !== cbbrPolicyAreaId
        )
          return false;

        if (
          cbbrNeedGroupId !== null &&
          criteria.cbbrNeedGroupId !== cbbrNeedGroupId
        )
          return false;

        if (cbbrType !== null && criteria.cbbrType !== cbbrType) return false;

        if (
          agencyInitials !== null &&
          criteria.agencyInitials !== agencyInitials
        )
          return false;

        if (cbbrType !== null && criteria.cbbrType !== cbbrType) return false;

        if (
          cbbrAgencyResponseTypeId !== null &&
          !cbbrAgencyResponseTypeId.includes(criteria.cbbrAgencyResponseTypeId)
        )
          return false;

        if (isMapped !== null && criteria.isMapped !== isMapped) return false;

        if (
          isContinuedSupport !== null &&
          criteria.isContinuedSupport !== isContinuedSupport
        )
          return false;

        return true;
      })
      .map(([_, budgetRequest]) => budgetRequest);
  }

  async findMany(params: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: string | null;
    cbbrAgencyResponseTypeId: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
    limit: number;
    offset: number;
  }): Promise<FindManyCommunityBoardBudgetRequestRepo> {
    return await this.filterCommunityBoardBudgetRequests(params);
  }

  async findCount(params: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: string | null;
    cbbrAgencyResponseTypeId: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
    limit: number;
    offset: number;
  }): Promise<FindCountCommunityBoardBudgetRequestRepo> {
    const cbbrs = await this.filterCommunityBoardBudgetRequests(params);

    return cbbrs.length;
  }
}
