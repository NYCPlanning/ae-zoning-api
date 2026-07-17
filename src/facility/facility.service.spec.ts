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

    it("should return a list of facilities filtered by borough ids", async () => {
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
      const agency = agencyRepositoryMock.agencies[0].name;
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
});
