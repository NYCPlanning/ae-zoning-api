import { Test } from "@nestjs/testing";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { BoroughRepository } from "src/borough/borough.repository";
import { SpatialRepositoryMock } from "test/spatial/spatial.repository.mock";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { FacilityService } from "./facility.service";
import { FacilityRepositoryMock } from "test/facility/facility.repository.mock";
import { FacilityModule } from "./facility.module";
import { FacilityRepository } from "./facility.repository";
import {
  facilityCsvRepoSchema,
  findCsvRepoSchema,
} from "./facility.repository.schema";
import {
  findFacilitiesQueryResponseSchema,
  findFacilityByIdQueryResponseSchema,
} from "src/gen/zod";
import { ResourceNotFoundException } from "src/exception/resource-not-found";
import { InvalidRequestParameterException } from "src/exception";

describe("Facility service unit", () => {
  let facilityService: FacilityService;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const facilityRepositoryMock = new FacilityRepositoryMock(
    agencyRepositoryMock,
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
  );
  const spatialRepositoryMock = new SpatialRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FacilityModule],
    })
      .overrideProvider(FacilityRepository)
      .useValue(facilityRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .overrideProvider(SpatialRepository)
      .useValue(spatialRepositoryMock)
      .compile();

    facilityService = moduleRef.get<FacilityService>(FacilityService);
  });

  describe("findById", () => {
    it("should return a findFacilityByIdResponseSchema compliant object", async () => {
      const facilityMock = facilityRepositoryMock.findByIdMocks[0];
      const facility = await facilityService.findById({
        facilityId: facilityMock.id,
      });
      expect(() =>
        findFacilityByIdQueryResponseSchema.parse(facility),
      ).not.toThrow();
    });

    it("should throw a ResourceNotFoundException if the facility is not found", async () => {
      const facilityId = "non-existent-facility-id";
      await expect(facilityService.findById({ facilityId })).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findMany", () => {
    it("should return a list of facilities", async () => {
      const facilities = await facilityService.findMany({});

      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilities),
      ).not.toThrow();

      const parsedBody = findFacilitiesQueryResponseSchema.parse(facilities);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBe(
        facilityRepositoryMock.findManyMocks.length,
      );
      expect(parsedBody.facilities.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
      expect(parsedBody.totalFacilities).toBe(parsedBody.facilities.length);
    });

    it("should return a list of facilities filtered by borough ids", async () => {
      const { id } = boroughRepositoryMock.boroughs[0];

      const facilities = await facilityService.findMany({
        boroughIds: [id],
      });

      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilities),
      ).not.toThrow();

      const parsedBody = findFacilitiesQueryResponseSchema.parse(facilities);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
      expect(parsedBody.totalFacilities).toBe(parsedBody.facilities.length);
    });

    it("should return an InvalidRequestParameterException when a provided borough id cannot be found", async () => {
      const id = "6";

      expect(
        facilityService.findMany({
          boroughIds: [id],
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return a list of facilities filtered by community districts", async () => {
      const facilities = await facilityService.findMany({
        communityDistrictIds: [
          `${communityDistrictRepositoryMock.districts[0].boroughId}${communityDistrictRepositoryMock.districts[0].id}`,
          `${communityDistrictRepositoryMock.districts[1].boroughId}${communityDistrictRepositoryMock.districts[1].id}`,
        ],
      });

      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilities),
      ).not.toThrow();

      const parsedBody = findFacilitiesQueryResponseSchema.parse(facilities);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
      expect(parsedBody.totalFacilities).toBe(parsedBody.facilities.length);
    });

    it("should return an InvalidRequestParameterException when a provided community district id cannot be found", async () => {
      const id = "601";

      expect(
        facilityService.findMany({
          communityDistrictIds: [id],
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return a list of facilities filtered by city council districts", async () => {
      const facilities = await facilityService.findMany({
        cityCouncilDistrictIds: [
          cityCouncilDistrictRepositoryMock.districts[0].id,
          cityCouncilDistrictRepositoryMock.districts[1].id,
        ],
      });

      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilities),
      ).not.toThrow();

      const parsedBody = findFacilitiesQueryResponseSchema.parse(facilities);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
      expect(parsedBody.totalFacilities).toBe(parsedBody.facilities.length);
    });

    it("should return an InvalidRequestParameterException when a provided city council district id cannot be found", async () => {
      const id = "601";

      expect(
        facilityService.findMany({
          cityCouncilDistrictIds: [id],
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return a list of facilities filtered by oversight agency", async () => {
      const agency = agencyRepositoryMock.agencies[0].initials;
      const facilities = await facilityService.findMany({
        facilityOversightAgency: agency,
      });

      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilities),
      ).not.toThrow();

      const parsedBody = findFacilitiesQueryResponseSchema.parse(facilities);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
      expect(parsedBody.totalFacilities).toBe(parsedBody.facilities.length);
    });

    it("should filter by geometry", async () => {
      const geometry = "Point";
      const lons = [-73.0];
      const lats = [40.708219];

      const facilitiesResponse = await facilityService.findMany({
        geometry,
        lons,
        lats,
      });
      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilitiesResponse),
      ).not.toThrow();

      const parsedBody =
        findFacilitiesQueryResponseSchema.parse(facilitiesResponse);

      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBe(8);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
    });

    it("should filter by geometry and buffer", async () => {
      const geometry = "Point";
      const lons = [-74.010521];
      const lats = [40.708219];
      const buffer = 0.26;

      const facilitiesResponse = await facilityService.findMany({
        geometry,
        lons,
        lats,
        buffer,
      });
      expect(() =>
        findFacilitiesQueryResponseSchema.parse(facilitiesResponse),
      ).not.toThrow();

      const parsedBody =
        findFacilitiesQueryResponseSchema.parse(facilitiesResponse);

      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.facilities.length).toBe(8);
      expect(parsedBody.total).toBe(parsedBody.facilities.length);
    });

    it("should return an InvalidRequestParameterException a geometry is provided without coordinates", async () => {
      const geometry = "Point";

      expect(
        facilityService.findMany({
          geometry,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return an InvalidRequestParameterException when coordinates are provided without a geometry", async () => {
      const lons = [-74.01];
      const lats = [40.7];

      expect(
        facilityService.findMany({
          lons,
          lats,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return an InvalidRequestParameterException when a buffer is provided without a geometry", async () => {
      const buffer = 1e6;

      expect(
        facilityService.findMany({
          buffer,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return an InvalidRequestParameterException when the lon and lat lengths differ", async () => {
      const geometry = "Point";
      const lons = [-74.010521, -74.010521];
      const lats = [40.708219];

      expect(
        facilityService.findMany({
          geometry,
          lons,
          lats,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });
  });

  describe("findCsv", () => {
    it("should return a list of facilities for download", async () => {
      const csv = await facilityService.findCsv({});
      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(facilityRepositoryMock.findCsvMocks.length);
      const firstItem = csv[0];
      expect(() =>
        facilityCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of facilities for download filtered by borough ids", async () => {
      const { id } = boroughRepositoryMock.boroughs[0];

      const csv = await facilityService.findCsv({
        boroughIds: [id],
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(4);
      const firstItem = csv[0];
      expect(() =>
        facilityCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of facilities for download filtered by community districts", async () => {
      const csv = await facilityService.findCsv({
        communityDistrictIds: [
          `${communityDistrictRepositoryMock.districts[0].boroughId}${communityDistrictRepositoryMock.districts[0].id}`,
          `${communityDistrictRepositoryMock.districts[1].boroughId}${communityDistrictRepositoryMock.districts[1].id}`,
        ],
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(8);
      const firstItem = csv[0];
      expect(() =>
        facilityCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of facilities for download filtered by city council districts", async () => {
      const csv = await facilityService.findCsv({
        cityCouncilDistrictIds: [
          cityCouncilDistrictRepositoryMock.districts[0].id,
          cityCouncilDistrictRepositoryMock.districts[1].id,
        ],
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(8);
      const firstItem = csv[0];
      expect(() =>
        facilityCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of facilities for download filtered by oversight agency", async () => {
      const agency = agencyRepositoryMock.agencies[0].initials;
      const csv = await facilityService.findCsv({
        facilityOversightAgency: agency,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(4);
      const firstItem = csv[0];
      expect(() =>
        facilityCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });
  });

  describe("findCategories", () => {
    it("should return a list of facility categories", async () => {
      const categories = await facilityService.findCategories();

      expect(categories.length).toBe(
        facilityRepositoryMock.findCategoriesMocks.length,
      );
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe("findAgencies", () => {
    it("should return a list of facility agencies", async () => {
      const agencies = await facilityService.findAgencies();

      expect(agencies.length).toBe(
        facilityRepositoryMock.findAgenciesMocks.length,
      );
      expect(agencies.length).toBeGreaterThan(0);
    });
  });
});
