import { generateMock } from "@anatine/zod-mock";
import {
  checkByManagingCodeCapitalProjectIdRepoSchema,
  FindByManagingCodeCapitalProjectIdRepo,
  findByManagingCodeCapitalProjectIdRepoSchema,
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdRepoSchema,
  FindGeoJsonByManagingCodeCapitalProjectIdRepo,
  findGeoJsonByManagingCodeCapitalProjectIdRepoSchema,
  FindManyRepo,
  findManyRepoSchema,
  findTilesRepoSchema,
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

  get findManyMocks(): Array<
    [
      {
        managingAgency: string;
        cityCouncilDistrictId: string;
        boroughId: string;
        communityDistrictId: string;
        agencyBudget: string;
        commitmentsTotal: number;
      },
      FindManyRepo,
    ]
  > {
    const agencyMocks = this.agencyRepoMock.agencies;
    const cityCouncilDistrictIdMocks =
      this.cityCouncilDistrictRepoMock.checkCityCouncilDistrictByIdMocks;
    const communityDistrictIdMocks =
      this.communityDistrictRepoMock.checkByBoroughIdCommunityDistrictIdMocks;
    const agencyBudgetMocks = this.agencyBudgetRepositoryMock.checkByCodeMocks;
    return [
      [
        {
          managingAgency: agencyMocks[0].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[0].id,
          boroughId: communityDistrictIdMocks[0].boroughId,
          communityDistrictId: communityDistrictIdMocks[0].id,
          agencyBudget: agencyBudgetMocks[0].code,
          commitmentsTotal: 100,
        },
        generateMock(findManyRepoSchema, {
          seed: 1,
          stringMap: {
            minDate: () => "2018-01-01",
            maxDate: () => "2045-12-31",
          },
        }),
      ],
      [
        {
          managingAgency: agencyMocks[1].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[0].id,
          boroughId: communityDistrictIdMocks[1].boroughId,
          communityDistrictId: communityDistrictIdMocks[1].id,
          agencyBudget: agencyBudgetMocks[1].code,
          commitmentsTotal: 200,
        },
        generateMock(findManyRepoSchema, {
          seed: 2,
          stringMap: {
            minDate: () => "2018-01-01",
            maxDate: () => "2045-12-31",
          },
        }),
      ],
      [
        {
          managingAgency: agencyMocks[1].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[1].id,
          boroughId: communityDistrictIdMocks[1].boroughId,
          communityDistrictId: communityDistrictIdMocks[1].id,
          agencyBudget: agencyBudgetMocks[1].code,
          commitmentsTotal: 300,
        },
        generateMock(findManyRepoSchema, {
          seed: 3,
          stringMap: {
            minDate: () => "2018-01-01",
            maxDate: () => "2045-12-31",
          },
        }),
      ],
    ];
  }

  async findAll({
    managingAgency,
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    agencyBudget,
    commitmentsTotalMin,
    commitmentsTotalMax,
  }: {
    managingAgency: string | null;
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    agencyBudget: string | null;
    commitmentsTotalMin: number | null;
    commitmentsTotalMax: number | null;
  }) {
    return this.findManyMocks.reduce(
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
    limit: number;
    offset: number;
  }) {
    const results = await this.findAll({
      managingAgency,
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      agencyBudget,
      commitmentsTotalMin,
      commitmentsTotalMax,
    });
    return results.slice(offset, limit + offset);
  }

  async findCount({
    managingAgency,
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    agencyBudget,
    commitmentsTotalMin,
    commitmentsTotalMax,
  }: {
    managingAgency: string | null;
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    agencyBudget: string | null;
    commitmentsTotalMin: number | null;
    commitmentsTotalMax: number | null;
  }) {
    const results = await this.findAll({
      managingAgency,
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      agencyBudget,
      commitmentsTotalMin,
      commitmentsTotalMax,
    });
    return results.length;
  }

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
