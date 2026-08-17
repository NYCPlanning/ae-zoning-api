import { generateMock } from "@anatine/zod-mock";
import {
  FindCsvRepo,
  facilityCsvRepoSchema,
  FacilityCsvRepoSchema,
  findByIdRepoSchema,
  FindByIdRepo,
  FindManyRepo,
} from "src/facility/facility.repository.schema";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";

export class FacilityRepositoryMock {
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

  findByIdMocks = generateMock(findByIdRepoSchema, {
    seed: 1,
    stringMap: {
      facilityJurisdiction: () => "City",
      facilityOperatorType: () => "Public",
      sgrLtr: () => "A",
      sgrArcLtr: () => "B",
      sgrSysLtr: () => "C",
    },
  });

  async findById({
    facilityId,
  }: {
    facilityId: string;
  }): Promise<FindByIdRepo> {
    const facility = this.findByIdMocks.find((f) => f.id === facilityId);
    return facility === undefined ? [] : [facility];
  }

  findManyMocks = Array.from(Array(8), (_, i) =>
    generateMock(facilityCsvRepoSchema, {
      seed: i + 1,
    }),
  );

  findCsvMocks = Array.from(Array(8), (_, i) =>
    generateMock(facilityCsvRepoSchema, {
      seed: i + 1,
    }),
  );

  get findManyCriteria(): Array<
    [
      {
        boroughId: string;
        facilityJurisdiction: string | null;
        facilityOperatorType: string | null;
        facilityOversightAgency: string | null;
        facilityCategoryId: number | null;
        facilityGroupId: number | null;
        facilitySubgroupId: number | null;
        communityDistrictId: string;
        cityCouncilDistrictId: string;
        bbl: string | null;
        bin: string | null;
      },
      FacilityCsvRepoSchema,
    ]
  > {
    const communityDistricts = this.communityDistrictRepoMock.districts;
    const cityCouncilDistrictRepoMock =
      this.cityCouncilDistrictRepoMock.districts;
    const agencies = this.agencyRepoMock.agencies;

    return this.findManyMocks.map((mockFacilityManyResponse, i) => [
      {
        boroughId: communityDistricts[i % 2].boroughId,
        facilityJurisdiction: mockFacilityManyResponse.facilityJurisdiction,
        facilityOperatorType: mockFacilityManyResponse.facilityOperatorType,
        facilityOversightAgency: agencies[i % 2].initials,
        facilityCategoryId: i,
        facilityGroupId: i,
        facilitySubgroupId: i,
        communityDistrictId: communityDistricts[i % 2].id,
        cityCouncilDistrictId: cityCouncilDistrictRepoMock[i % 2].id,
        bbl: mockFacilityManyResponse.bbl,
        bin: mockFacilityManyResponse.bin,
      },
      mockFacilityManyResponse,
    ]);
  }

  get findCsvCriteria(): Array<
    [
      {
        boroughId: string;
        facilityJurisdiction: string | null;
        facilityOperatorType: string | null;
        facilityOversightAgency: string | null;
        facilityCategoryId: number | null;
        facilityGroupId: number | null;
        facilitySubgroupId: number | null;
        communityDistrictId: string;
        cityCouncilDistrictId: string;
        bbl: string | null;
        bin: string | null;
      },
      FacilityCsvRepoSchema,
    ]
  > {
    const communityDistricts = this.communityDistrictRepoMock.districts;
    const cityCouncilDistrictRepoMock =
      this.cityCouncilDistrictRepoMock.districts;
    const agencies = this.agencyRepoMock.agencies;

    return this.findCsvMocks.map((mockFacilityCsvResponse, i) => [
      {
        boroughId: communityDistricts[i % 2].boroughId,
        facilityJurisdiction: mockFacilityCsvResponse.facilityJurisdiction,
        facilityOperatorType: mockFacilityCsvResponse.facilityOperatorType,
        facilityOversightAgency: agencies[i % 2].initials,
        facilityCategoryId: i,
        facilityGroupId: i,
        facilitySubgroupId: i,
        communityDistrictId: communityDistricts[i % 2].id,
        cityCouncilDistrictId: cityCouncilDistrictRepoMock[i % 2].id,
        bbl: mockFacilityCsvResponse.bbl,
        bin: mockFacilityCsvResponse.bin,
      },
      mockFacilityCsvResponse,
    ]);
  }

  async filterFacilities({
    boroughIds,
    facilityJurisdiction,
    facilityOperatorType,
    facilityOversightAgency,
    facilityCategoryId,
    facilityGroupId,
    facilitySubgroupId,
    communityDistrictIds,
    cityCouncilDistrictIds,
    bbl,
    bin,
  }: {
    boroughIds: Array<string> | null;
    facilityJurisdiction: string | null;
    facilityOperatorType: string | null;
    facilityOversightAgency: string | null;
    facilityCategoryId: number | null;
    facilityGroupId: number | null;
    facilitySubgroupId: number | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
  }): Promise<FindManyRepo> {
    return this.findManyCriteria
      .filter(([criteria, _]) => {
        if (boroughIds !== null && !boroughIds.includes(criteria.boroughId))
          return false;

        if (
          communityDistrictIds !== null &&
          !communityDistrictIds.includes(
            `${criteria.boroughId}${criteria.communityDistrictId}`,
          )
        )
          return false;

        if (
          cityCouncilDistrictIds !== null &&
          !cityCouncilDistrictIds.includes(criteria.cityCouncilDistrictId)
        )
          return false;

        if (
          facilityJurisdiction !== undefined &&
          criteria.facilityJurisdiction !== facilityJurisdiction
        )
          return false;

        if (
          facilityOperatorType !== undefined &&
          criteria.facilityOperatorType !== facilityOperatorType
        )
          return false;

        if (
          facilityOversightAgency !== null &&
          criteria.facilityOversightAgency !== facilityOversightAgency
        )
          return false;

        if (
          facilityCategoryId !== undefined &&
          criteria.facilityCategoryId !== facilityCategoryId
        )
          return false;

        if (
          facilityGroupId !== undefined &&
          criteria.facilityGroupId !== facilityGroupId
        )
          return false;

        if (
          facilitySubgroupId !== undefined &&
          criteria.facilitySubgroupId !== facilitySubgroupId
        )
          return false;

        if (bbl !== null && criteria.bbl !== bbl) return false;

        if (bin !== null && criteria.bin !== bin) return false;

        return true;
      })
      .map(([criteria, facility]) => {
        return {
          id: facility.id,
          name: facility.name,
          oversightAgencyInitials: facility.oversightAgency,
          categoryId: criteria.facilityCategoryId,
          hasSogrData: facility.sgrLtr !== null,
        };
      });
  }

  async filterFacilitiesCsv({
    boroughIds,
    facilityJurisdiction,
    facilityOperatorType,
    facilityOversightAgency,
    facilityCategoryId,
    facilityGroupId,
    facilitySubgroupId,
    communityDistrictIds,
    cityCouncilDistrictIds,
    bbl,
    bin,
  }: {
    boroughIds: Array<string> | null;
    facilityJurisdiction: string | null;
    facilityOperatorType: string | null;
    facilityOversightAgency: string | null;
    facilityCategoryId: number | null;
    facilityGroupId: number | null;
    facilitySubgroupId: number | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
  }): Promise<FindCsvRepo> {
    return this.findCsvCriteria
      .filter(([criteria, _]) => {
        if (boroughIds !== null && !boroughIds.includes(criteria.boroughId))
          return false;

        if (
          communityDistrictIds !== null &&
          !communityDistrictIds.includes(
            `${criteria.boroughId}${criteria.communityDistrictId}`,
          )
        )
          return false;

        if (
          cityCouncilDistrictIds !== null &&
          !cityCouncilDistrictIds.includes(criteria.cityCouncilDistrictId)
        )
          return false;

        if (
          facilityJurisdiction !== undefined &&
          criteria.facilityJurisdiction !== facilityJurisdiction
        )
          return false;

        if (
          facilityOperatorType !== undefined &&
          criteria.facilityOperatorType !== facilityOperatorType
        )
          return false;

        if (
          facilityOversightAgency !== null &&
          criteria.facilityOversightAgency !== facilityOversightAgency
        )
          return false;

        if (
          facilityCategoryId !== undefined &&
          criteria.facilityCategoryId !== facilityCategoryId
        )
          return false;

        if (
          facilityGroupId !== undefined &&
          criteria.facilityGroupId !== facilityGroupId
        )
          return false;

        if (
          facilitySubgroupId !== undefined &&
          criteria.facilitySubgroupId !== facilitySubgroupId
        )
          return false;

        if (bbl !== null && criteria.bbl !== bbl) return false;

        if (bin !== null && criteria.bin !== bin) return false;

        return true;
      })
      .map(([_, facility]) => facility);
  }

  async findMany(params: {
    boroughIds: Array<string> | null;
    facilityJurisdiction: string | null;
    facilityOperatorType: string | null;
    facilityOversightAgency: string;
    facilityCategoryId: number | null;
    facilityGroupId: number | null;
    facilitySubgroupId: number | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
  }): Promise<FindManyRepo> {
    return await this.filterFacilities(params);
  }

  async findCount(params: {
    boroughIds: Array<string> | null;
    facilityJurisdiction: string | null;
    facilityOperatorType: string | null;
    facilityOversightAgency: string;
    facilityCategoryId: number | null;
    facilityGroupId: number | null;
    facilitySubgroupId: number | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
  }): Promise<number> {
    const facilities = await this.filterFacilities(params);

    return facilities.length;
  }

  async findCsv(params: {
    boroughIds: Array<string> | null;
    facilityJurisdiction: string | null;
    facilityOperatorType: string | null;
    facilityOversightAgency: string;
    facilityCategoryId: number | null;
    facilityGroupId: number | null;
    facilitySubgroupId: number | null;
    communityDistrictIds: Array<string> | null;
    cityCouncilDistrictIds: Array<string> | null;
    bbl: string | null;
    bin: string | null;
  }): Promise<FindCsvRepo> {
    return await this.filterFacilitiesCsv(params);
  }
}
