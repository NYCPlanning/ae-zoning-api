import { generateMock } from "@anatine/zod-mock";
import {
  CheckByManagingCodeCapitalProjectIdRepo,
  FindByManagingCodeCapitalProjectIdRepo,
  findByManagingCodeCapitalProjectIdRepoSchema,
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
  FindCountRepo,
  FindGeoJsonByManagingCodeCapitalProjectIdRepo,
  findGeoJsonByManagingCodeCapitalProjectIdRepoSchema,
  FindManyRepo,
  FindTilesRepo,
} from "src/capital-project/capital-project.repository.schema";
import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
} from "src/gen";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { agencyEntitySchema, capitalProjectEntitySchema } from "src/schema";
import { generateMockMvt } from "test/utils";

export class CapitalProjectRepositoryMock {
  agencyRepoMock: AgencyRepositoryMock;
  cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock;
  communityDistrictRepoMock: CommunityDistrictRepositoryMock;
  agencyBudgetRepositoryMock: AgencyBudgetRepositoryMock;
  constructor(
    agencyRepoMock: AgencyRepositoryMock,
    cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock,
    communityDistrictRepoMock: CommunityDistrictRepositoryMock,
    agencyBudgetRepositoryMock: AgencyBudgetRepositoryMock,
  ) {
    this.agencyRepoMock = agencyRepoMock;
    this.cityCouncilDistrictRepoMock = cityCouncilDistrictRepoMock;
    this.communityDistrictRepoMock = communityDistrictRepoMock;
    this.agencyBudgetRepositoryMock = agencyBudgetRepositoryMock;
  }

  capitalProjectGroups = Array.from(Array(3), (_, i) =>
    Array.from(Array(i + 2), (_, j) =>
      generateMock(capitalProjectEntitySchema, {
        seed: j + 1,
        stringMap: {
          minDate: () => "2018-01-01",
          maxDate: () => "2045-12-31",
        },
      }),
    ),
  );

  get capitalProjectsCriteria(): Array<
    [
      {
        managingAgency: string;
        cityCouncilDistrictId: string;
        boroughId: string;
        communityDistrictId: string;
        agencyBudget: string;
        commitmentsTotal: number;
        liFtMPoly: string | null;
        liFtMPnt: string | null;
      },
      FindManyRepo,
    ]
  > {
    const agencyMocks = this.agencyRepoMock.agencies;
    const cityCouncilDistrictIdMocks =
      this.cityCouncilDistrictRepoMock.districts;
    const communityDistrictIdMocks = this.communityDistrictRepoMock.districts;
    const agencyBudgetMocks = this.agencyBudgetRepositoryMock.agencyBudgets;
    return [
      [
        {
          managingAgency: agencyMocks[0].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[0].id,
          boroughId: communityDistrictIdMocks[0].boroughId,
          communityDistrictId: communityDistrictIdMocks[0].id,
          agencyBudget: agencyBudgetMocks[0].code,
          commitmentsTotal: 100,
          liFtMPnt: "EXISTS",
          liFtMPoly: null,
        },
        this.capitalProjectGroups[0],
      ],
      [
        {
          managingAgency: agencyMocks[1].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[0].id,
          boroughId: communityDistrictIdMocks[1].boroughId,
          communityDistrictId: communityDistrictIdMocks[1].id,
          agencyBudget: agencyBudgetMocks[1].code,
          commitmentsTotal: 200,
          liFtMPnt: null,
          liFtMPoly: "EXISTS",
        },
        this.capitalProjectGroups[1],
      ],
      [
        {
          managingAgency: agencyMocks[1].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[1].id,
          boroughId: communityDistrictIdMocks[1].boroughId,
          communityDistrictId: communityDistrictIdMocks[1].id,
          agencyBudget: agencyBudgetMocks[1].code,
          commitmentsTotal: 300,
          liFtMPnt: null,
          liFtMPoly: null,
        },
        this.capitalProjectGroups[2],
      ],
    ];
  }

  async filterCapitalProjects({
    managingAgency,
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    agencyBudget,
    commitmentsTotalMin,
    commitmentsTotalMax,
    isMapped,
  }: {
    managingAgency: string | null;
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    agencyBudget: string | null;
    commitmentsTotalMin: number | null;
    commitmentsTotalMax: number | null;
    isMapped: boolean | null;
  }) {
    return this.capitalProjectsCriteria.reduce(
      (acc: FindManyRepo, [criteria, capitalProjects]) => {
        if (
          managingAgency !== null &&
          criteria.managingAgency !== managingAgency
        )
          return acc;

        if (
          cityCouncilDistrictId !== null &&
          criteria.cityCouncilDistrictId !== cityCouncilDistrictId
        )
          return acc;

        if (boroughId !== null && criteria.boroughId !== boroughId) return acc;

        if (
          communityDistrictId !== null &&
          criteria.communityDistrictId !== communityDistrictId
        )
          return acc;

        if (agencyBudget !== null && criteria.agencyBudget !== agencyBudget)
          return acc;

        if (
          commitmentsTotalMin !== null &&
          criteria.commitmentsTotal <= commitmentsTotalMin
        )
          return acc;
        if (
          commitmentsTotalMax !== null &&
          criteria.commitmentsTotal >= commitmentsTotalMax
        )
          return acc;
        if (
          (isMapped === true &&
            (criteria.liFtMPoly !== null || criteria.liFtMPnt !== null)) ||
          (isMapped === false &&
            criteria.liFtMPoly === null &&
            criteria.liFtMPnt === null)
        )
          return acc;
        return acc.concat(capitalProjects);
      },
      [],
    );
  }

  async findMany({
    managingAgency,
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    agencyBudget,
    commitmentsTotalMin,
    commitmentsTotalMax,
    isMapped,
    limit,
    offset,
  }: {
    managingAgency: string | null;
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    agencyBudget: string | null;
    commitmentsTotalMin: number | null;
    commitmentsTotalMax: number | null;
    isMapped: boolean | null;
    limit: number;
    offset: number;
  }): Promise<FindManyRepo> {
    const results = await this.filterCapitalProjects({
      managingAgency,
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      agencyBudget,
      commitmentsTotalMin,
      commitmentsTotalMax,
      isMapped,
    });
    return results.slice(offset, limit + offset);
  }

  managingAgenciesMock = Array.from(Array(10), (_, index) =>
    generateMock(agencyEntitySchema, { seed: index + 1 }),
  );

  findManagingAgencies() {
    return this.managingAgenciesMock;
  }

  async findCount({
    managingAgency,
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    agencyBudget,
    commitmentsTotalMin,
    commitmentsTotalMax,
    isMapped,
  }: {
    managingAgency: string | null;
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    agencyBudget: string | null;
    commitmentsTotalMin: number | null;
    commitmentsTotalMax: number | null;
    isMapped: boolean | null;
  }): Promise<FindCountRepo> {
    const results = await this.filterCapitalProjects({
      managingAgency,
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      agencyBudget,
      commitmentsTotalMin,
      commitmentsTotalMax,
      isMapped,
    });
    return results.length;
  }

  async checkByManagingCodeCapitalProjectId(
    managingCode: string,
    capitalProjectId: string,
  ): Promise<CheckByManagingCodeCapitalProjectIdRepo> {
    return this.capitalProjectGroups.some((capitalProjects) =>
      capitalProjects.some((capitalProject) => {
        return (
          capitalProject.id === capitalProjectId &&
          capitalProject.managingCode === managingCode
        );
      }),
    );
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
    this.capitalProjectGroups.reduce(
      (
        acc: Array<
          Record<
            string,
            FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo
          >
        >,
        capitalProjects,
      ) => {
        const capitalCommitments = capitalProjects.map((capitalProject) => {
          return {
            [`${capitalProject.managingCode}${capitalProject.id}`]:
              generateMock(
                findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
                {
                  stringMap: {
                    plannedDate: () => "2045-01-01",
                  },
                },
              ),
          };
        });
        return acc.concat(capitalCommitments);
      },
      [],
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

  findGeoJsonByManagingCodeCapitalProjectIdMock = generateMock(
    findGeoJsonByManagingCodeCapitalProjectIdRepoSchema,
    {
      seed: 1,
      stringMap: {
        minDate: () => "2018-01-01",
        maxDate: () => "2045-12-31",
      },
    },
  );

  async findGeoJsonByManagingCodeCapitalProjectId({
    managingCode,
    capitalProjectId,
  }: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams): Promise<FindGeoJsonByManagingCodeCapitalProjectIdRepo> {
    const results = this.findGeoJsonByManagingCodeCapitalProjectIdMock.filter(
      (capitalProjectGeoJson) =>
        capitalProjectGeoJson.id === capitalProjectId &&
        capitalProjectGeoJson.managingCode === managingCode,
    );

    return results === undefined ? [] : results;
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
  async findTiles(): Promise<FindTilesRepo> {
    return this.findTilesMock;
  }
}
