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
  constructor(
    agencyRepoMock: AgencyRepositoryMock,
    cityCouncilDistrictRepoMock: CityCouncilDistrictRepositoryMock,
    communityDistrictRepoMock: CommunityDistrictRepositoryMock,
  ) {
    this.agencyRepoMock = agencyRepoMock;
    this.cityCouncilDistrictRepoMock = cityCouncilDistrictRepoMock;
    this.communityDistrictRepoMock = communityDistrictRepoMock;
  }

  get findManyMocks(): Array<
    [
      {
        managingAgency: string;
        cityCouncilDistrictId: string;
        boroughId: string;
        communityDistrictId: string;
      },
      FindManyRepo,
    ]
  > {
    const agencyMocks = this.agencyRepoMock.checkByInitialsMocks;
    const cityCouncilDistrictIdMocks =
      this.cityCouncilDistrictRepoMock.checkCityCouncilDistrictByIdMocks;
    const communityDistrictIdMocks =
      this.communityDistrictRepoMock.checkByBoroughIdCommunityDistrictIdMocks;
    return [
      [
        {
          managingAgency: agencyMocks[0].initials,
          cityCouncilDistrictId: cityCouncilDistrictIdMocks[0].id,
          boroughId: communityDistrictIdMocks[0].boroughId,
          communityDistrictId: communityDistrictIdMocks[0].id,
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

  async findMany({
    managingAgency,
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    limit,
    offset,
  }: {
    managingAgency: string | null;
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    limit: number;
    offset: number;
  }) {
    return this.findManyMocks
      .reduce((acc: FindManyRepo, [criteria, capitalProjects]) => {
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

        return acc.concat(capitalProjects);
      }, [])
      .slice(offset, limit + offset);
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
