import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { FacilityRepositoryMock } from "./facility.repository.mock";
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
import { FacilityModule } from "src/facility/facility.module";
import { FacilityRepository } from "src/facility/facility.repository";
import {
  findFacilityAgenciesQueryResponseSchema,
  findFacilityByIdQueryResponseSchema,
  findFacilityCategoriesQueryResponseSchema,
} from "src/gen";

describe("Facility e2e", () => {
  let app: INestApplication;

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

  beforeAll(async () => {
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
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findById", () => {
    it("should 200 and return a facility", async () => {
      const facilityMock = facilityRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/facilities/${facilityMock.id}`)
        .expect(200);

      expect(() =>
        findFacilityByIdQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 400 when finding by a non-valid string", async () => {
      const facilityId = "%%";
      const response = await request(app.getHttpServer())
        .get(`/facilities/${facilityId}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by non-existent facility id", async () => {
      const facilityId = "1234XYZ";
      const response = await request(app.getHttpServer())
        .get(`/facilities/${facilityId}`)
        .expect(404);

      expect(response.body.message).toMatch(/Cannot find Facility/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(facilityRepositoryMock, "findById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const facilityMock = facilityRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/facilities/${facilityMock.id}`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findMany", () => {
    it("should 200 and return facilities", async () => {
      await request(app.getHttpServer()).get(`/facilities`).expect(200);
    });

    it("should 200 when finding facilities by boroughIds", async () => {
      const borough = boroughRepositoryMock.boroughs[0];
      await request(app.getHttpServer())
        .get(`/facilities?boroughIds=${borough.id}`)
        .expect(200);
    });

    it("should 200 when finding facilities by communityDistrictIds", async () => {
      await request(app.getHttpServer())
        .get(
          `/facilities?communityDistrictIds=${communityDistrictRepositoryMock.districts[0].boroughId}${communityDistrictRepositoryMock.districts[0].id},${communityDistrictRepositoryMock.districts[1].boroughId}${communityDistrictRepositoryMock.districts[1].id}`,
        )
        .expect(200);
    });

    it("should 200 when finding facilities by cityCouncilDistrictIds", async () => {
      await request(app.getHttpServer())
        .get(
          `/facilities?cityCouncilDistrictIds=${cityCouncilDistrictRepositoryMock.districts[0].id},${cityCouncilDistrictRepositoryMock.districts[1].id}`,
        )
        .expect(200);
    });

    it("should 200 when finding facilities by oversight agency", async () => {
      const agency = agencyRepositoryMock.agencies[0];

      await request(app.getHttpServer())
        .get(`/facilities?facilityOversightAgency=${agency.initials}`)
        .expect(200);
    });

    it("should 400 when finding facilities by invalid communityDistrictIds", async () => {
      const communityDistrictIds = false;

      const response = await request(app.getHttpServer())
        .get(`/facilities?communityDistrictIds=${communityDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: communityDistrictIds: Invalid/,
      );
    });

    it("should 400 when finding facilities by missing communityDistrictIds", async () => {
      const communityDistrictIds = "909,808";

      const response = await request(app.getHttpServer())
        .get(`/facilities?communityDistrictIds=${communityDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /could not check one or more of the parameters/,
      );
    });

    it("should 400 when finding facilities by invalid cityCouncilDistrictIds", async () => {
      const cityCouncilDistrictIds = false;

      const response = await request(app.getHttpServer())
        .get(`/facilities?cityCouncilDistrictIds=${cityCouncilDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cityCouncilDistrictIds: Invalid/,
      );
    });

    it("should 400 when finding facilities by missing cityCouncilDistrictIds", async () => {
      const cityCouncilDistrictIds = "90,91";

      const response = await request(app.getHttpServer())
        .get(`/facilities?cityCouncilDistrictIds=${cityCouncilDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /could not check one or more of the parameters/,
      );
    });

    it("should 400 when finding facilities by an invalid/missing oversight agency", async () => {
      const agencyInitials = false;

      const response = await request(app.getHttpServer())
        .get(`/facilities?facilityOversightAgency=${agencyInitials}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /could not check one or more of the parameters/,
      );
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(facilityRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/facilities`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCsv", () => {
    it("should 200 and return a csv", async () => {
      await request(app.getHttpServer()).get(`/facilities/csv`).expect(200);
    });

    it("should 200 when finding facilities by boroughIds", async () => {
      const borough = boroughRepositoryMock.boroughs[0];
      await request(app.getHttpServer())
        .get(`/facilities/csv?boroughIds=${borough.id}`)
        .expect(200);
    });

    it("should 200 when finding facilities by communityDistrictIds", async () => {
      await request(app.getHttpServer())
        .get(
          `/facilities/csv?communityDistrictIds=${communityDistrictRepositoryMock.districts[0].boroughId}${communityDistrictRepositoryMock.districts[0].id},${communityDistrictRepositoryMock.districts[1].boroughId}${communityDistrictRepositoryMock.districts[1].id}`,
        )
        .expect(200);
    });

    it("should 200 when finding facilities by cityCouncilDistrictIds", async () => {
      await request(app.getHttpServer())
        .get(
          `/facilities/csv?cityCouncilDistrictIds=${cityCouncilDistrictRepositoryMock.districts[0].id},${cityCouncilDistrictRepositoryMock.districts[1].id}`,
        )
        .expect(200);
    });

    it("should 200 when finding facilities by oversight agency", async () => {
      const agency = agencyRepositoryMock.agencies[0];

      await request(app.getHttpServer())
        .get(`/facilities/csv?facilityOversightAgency=${agency.initials}`)
        .expect(200);
    });

    it("should 400 when finding facilities by invalid communityDistrictIds", async () => {
      const communityDistrictIds = false;

      const response = await request(app.getHttpServer())
        .get(`/facilities/csv?communityDistrictIds=${communityDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: communityDistrictIds: Invalid/,
      );
    });

    it("should 400 when finding facilities by missing communityDistrictIds", async () => {
      const communityDistrictIds = "909,808";

      const response = await request(app.getHttpServer())
        .get(`/facilities/csv?communityDistrictIds=${communityDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /could not check one or more of the parameters/,
      );
    });

    it("should 400 when finding facilities by invalid cityCouncilDistrictIds", async () => {
      const cityCouncilDistrictIds = false;

      const response = await request(app.getHttpServer())
        .get(`/facilities/csv?cityCouncilDistrictIds=${cityCouncilDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cityCouncilDistrictIds: Invalid/,
      );
    });

    it("should 400 when finding facilities by missing cityCouncilDistrictIds", async () => {
      const cityCouncilDistrictIds = "90,91";

      const response = await request(app.getHttpServer())
        .get(`/facilities/csv?cityCouncilDistrictIds=${cityCouncilDistrictIds}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /could not check one or more of the parameters/,
      );
    });

    it("should 400 when finding facilities by an invalid/missing oversight agency", async () => {
      const agencyInitials = false;

      const response = await request(app.getHttpServer())
        .get(`/facilities/csv?facilityOversightAgency=${agencyInitials}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /could not check one or more of the parameters/,
      );
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(facilityRepositoryMock, "findCsv")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/facilities/csv`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe("findCategories", () => {
    it("should 200 and return facility categories", async () => {
      const response = await request(app.getHttpServer())
        .get(`/facilities/categories`)
        .expect(200);
      expect(() =>
        findFacilityCategoriesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );

      jest
        .spyOn(facilityRepositoryMock, "findCategories")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/facilities/categories`)
        .expect(500);

      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findAgencies", () => {
    it("should 200 and return facility agencies", async () => {
      const response = await request(app.getHttpServer())
        .get(`/facilities/agencies`)
        .expect(200);
      expect(() =>
        findFacilityAgenciesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );

      jest
        .spyOn(facilityRepositoryMock, "findAgencies")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/facilities/agencies`)
        .expect(500);

      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });
});
