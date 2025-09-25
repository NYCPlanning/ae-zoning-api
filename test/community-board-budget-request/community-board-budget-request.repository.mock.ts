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
  findManyCommunityBoardBudgetRequestsExtendedEntitySchema,
  FindManyCommunityBoardBudgetRequestsExtendedEntity,
  FindCountCommunityBoardBudgetRequestRepo,
  CheckAgencyResponseTypeByIdRepo,
} from "src/community-board-budget-request/community-board-budget-request.repository.schema";
import {
  CbbrNeedGroupEntitySchema,
  cbbrNeedGroupEntitySchema,
  CbbrPolicyAreaEntitySchema,
  cbbrPolicyAreaEntitySchema,
  AgencyEntitySchema,
} from "src/schema";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";

export class CommunityBoardBudgetRequestRepositoryMock {
  agencyRepoMock: AgencyRepositoryMock;
  cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock;

  constructor(
    agencyRepoMock: AgencyRepositoryMock,
    cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock,
  ) {
    this.agencyRepoMock = agencyRepoMock;
    this.cityCouncilDistrictRepoMock = cityCouncilDistrictRepoMock;
  }

  boroughsMocks = [
    {
      id: "1",
      title: "Manhattan",
      abbr: "MN",
    },
    {
      id: "2",
      title: "Bronx",
      abbr: "BX",
    },
    {
      id: "3",
      title: "Brooklyn",
      abbr: "BK",
    },
    {
      id: "4",
      title: "Queens",
      abbr: "QN",
    },
    {
      id: "5",
      title: "Staten Island",
      abbr: "SI",
    },
  ];

  getBoroughAbbrFromId(id: string) {
    return this.boroughsMocks.find((borough) => id === borough.id)?.abbr;
  }

  getBoroughIdFromAbbr(abbr: string) {
    return this.boroughsMocks.find((borough) => abbr === borough.abbr)?.id;
  }

  generateCommunityBoardId(i: number) {
    const borough = this.boroughsMocks.find(
      (borough) => borough.id === (((i + 1) % 5) + 1).toString(),
    );
    return `${borough === undefined ? "MN" : borough.abbr}${(i + 1).toString().padStart(2, "0")}`;
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

  manyCbbrMocks = Array.from(Array(8), (_, i) =>
    // Needs to be the full object to be able to filter, even though the return is findManyCommunityBoardBudgetRequestEntitySchema
    generateMock(findManyCommunityBoardBudgetRequestsExtendedEntitySchema, {
      seed: i + 1,
      stringMap: {
        cityCouncilDistrictId: () => (i + 1).toString(),
        communityBoardId: () => this.generateCommunityBoardId(i),
      },
    }),
  );

  checkNeedGroupById(id: number): CheckNeedGroupByIdRepo {
    return this.needGroupMocks.some((needGroup) => needGroup.id === id);
  }

  checkPolicyAreaById(id: number): CheckPolicyAreaByIdRepo {
    return this.policyAreaMocks.some((policyArea) => policyArea.id === id);
  }

  checkAgencyResponseTypeById(id: number): CheckAgencyResponseTypeByIdRepo {
    return this.manyCbbrMocks.some(
      (cbbr) => cbbr.agencyCategoryResponse === id,
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
  }) {
    return this.manyCbbrMocks.reduce(
      (
        acc: FindManyCommunityBoardBudgetRequestRepo,
        curr: FindManyCommunityBoardBudgetRequestsExtendedEntity,
      ) => {
        if (
          boroughId !== null &&
          this.getBoroughIdFromAbbr(curr.communityBoardId.slice(0, 2)) !==
            boroughId
        )
          return acc;
        if (
          communityDistrictId !== null &&
          `${this.getBoroughIdFromAbbr(curr.communityBoardId.slice(0, 2))}${curr.communityBoardId.slice(2, 4)}` !==
            communityDistrictId
        )
          return acc;
        if (
          cityCouncilDistrictId !== null &&
          curr.cityCouncilDistrictId !== cityCouncilDistrictId
        )
          return acc;
        if (
          cbbrPolicyAreaId !== null &&
          curr.cbbrPolicyAreaId !== cbbrPolicyAreaId
        )
          return acc;
        if (
          cbbrNeedGroupId !== null &&
          curr.cbbrNeedGroupId !== cbbrNeedGroupId
        )
          return acc;
        if (cbbrType !== null && curr.cbbrType !== cbbrType) return acc;
        if (agencyInitials !== null && curr.agencyInitials !== agencyInitials)
          return acc;
        if (cbbrType !== null && curr.cbbrType !== cbbrType) return acc;
        if (
          cbbrAgencyResponseTypeId !== null &&
          curr.agencyCategoryResponse !== null &&
          cbbrAgencyResponseTypeId.includes(curr.agencyCategoryResponse)
        )
          return acc;
        if (isMapped !== null && curr.isMapped !== isMapped) return acc;
        if (
          isContinuedSupport !== null &&
          curr.isContinuedSupport !== isContinuedSupport
        )
          return acc;

        return acc.concat({
          id: curr.id,
          cbbrPolicyAreaId: curr.cbbrPolicyAreaId,
          title: curr.title,
          communityBoardId: curr.communityBoardId,
          isMapped: curr.isMapped,
          isContinuedSupport: curr.isContinuedSupport,
        });
      },
      [],
    );
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
    const cbbrs = await this.filterCommunityBoardBudgetRequests(params);

    return cbbrs === undefined ? [] : cbbrs;
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

    return cbbrs.length === undefined ? 0 : cbbrs.length;
  }
}
