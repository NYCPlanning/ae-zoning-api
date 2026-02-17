import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CapitalProjectModule } from "src/capital-project/capital-project.module";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";
import { CapitalProjectRepositoryMock } from "./capital-project.repository.mock";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import * as request from "supertest";
import { HttpName } from "src/filter";
import { DataRetrievalException } from "src/exception";
import {
  findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectManagingAgenciesQueryResponseSchema,
  findCapitalProjectsQueryResponseSchema,
} from "src/gen";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { BoroughRepository } from "src/borough/borough.repository";
import { SpatialRepositoryMock } from "test/spatial/spatial.repository.mock";
import { SpatialRepository } from "src/spatial/spatial.repository";

describe("Capital Projects", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const agencyBudgetRepositoryMock = new AgencyBudgetRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock();
  const capitalProjectRepositoryMock = new CapitalProjectRepositoryMock(
    agencyRepositoryMock,
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
    agencyBudgetRepositoryMock,
  );
  const spatialRepositoryMock = new SpatialRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapitalProjectModule],
    })
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepositoryMock)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
      .overrideProvider(SpatialRepository)
      .useValue(spatialRepositoryMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("findMany", () => {
    it("should 200 and return paginated capital projects", async () => {
      const response = await request(app.getHttpServer())
        .get("/capital-projects")
        .expect(200);
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.total).toBe(9);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 200 and return capital projects with page metadata when specifying offset and limit", async () => {
      const limit = 5;
      const offset = 4;
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?limit=${limit}&offset=${offset}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(limit);
      expect(parsedBody.offset).toBe(offset);
      expect(parsedBody.total).toBe(5);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 200 and return capital projects with page metadata when specifying a valid agency budget code", async () => {
      const agencyBudget =
        capitalProjectRepositoryMock.agencyBudgetRepositoryMock
          .agencyBudgets[0];
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?agencyBudget=${agencyBudget.code}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.total).toBe(2);
    });

    it("should 400 when finding by an agency budget code that does not exist", async () => {
      const agencyBudgetCode = "DNE";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?agencyBudget=${agencyBudgetCode}`,
      );

      expect(response.body.message).toMatch(/could not check/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by an invalid limit", async () => {
      const response = await request(app.getHttpServer()).get(
        "/capital-projects?limit=b4d",
      );
      expect(response.body.message).toMatch(/limit: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a 'too-high' limit", async () => {
      const response = await request(app.getHttpServer()).get(
        "/capital-projects?limit=101",
      );
      expect(response.body.message).toMatch(/limit: Number must be less/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a 'too-low' limit", async () => {
      const response = await request(app.getHttpServer()).get(
        "/capital-projects?limit=0",
      );
      expect(response.body.message).toMatch(/limit: Number must be greater/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by invalid offset", async () => {
      const response = await request(app.getHttpServer()).get(
        "/capital-projects?offset=b4d",
      );
      expect(response.body.message).toMatch(/offset: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 200 and return capital projects from a specified city council district", async () => {
      const { id } =
        capitalProjectRepositoryMock.cityCouncilDistrictRepoMock.districts[0];
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?cityCouncilDistrictId=${id}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.total).toBe(5);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 400 when finding by invalid city council district id", async () => {
      const id = "123";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?cityCouncilDistrictId=${id}`,
      );
      expect(response.body.message).toMatch(/cityCouncilDistrictId: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 200 and return capital projects from a specified community district", async () => {
      const { boroughId, id: communityDistrictId } =
        capitalProjectRepositoryMock.communityDistrictRepoMock.districts[1];
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?communityDistrictId=${boroughId}${communityDistrictId}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
      expect(parsedBody.total).toBe(7);
    });

    it("should 400 when finding by invalid community district id", async () => {
      const id = "1234";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?communityDistrictId=${id}`,
      );
      expect(response.body.message).toMatch(/communityDistrictId: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 200 and return capital projects from a specified managing agency", async () => {
      const managingAgency =
        capitalProjectRepositoryMock.agencyRepoMock.agencies[0];
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?managingAgency=${managingAgency.initials}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(2);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 400 when finding by managing agency for agency that does not exist", async () => {
      const managingAgency = "DNE";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?managingAgency=${managingAgency}`,
      );
      expect(response.body.message).toMatch(/could not check/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 200 and return capital projects with total capital commitments above a specified minimum", async () => {
      const commitmentsTotalMin = "0";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?commitmentsTotalMin=${commitmentsTotalMin}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(9);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 400 when filtering with an invalid commitmentsTotalMin", async () => {
      const commitmentsTotalMin = "01,0.0001";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?commitmentsTotalMin=${commitmentsTotalMin}`,
      );
      expect(response.body.message).toMatch(/commitmentsTotalMin: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 200 and return capital projects with total capital commitments below a specified maximum", async () => {
      const commitmentsTotalMax = "100000000";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?commitmentsTotalMax=${commitmentsTotalMax}`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(9);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 400 when filtering with an invalid commitmentsTotalMax", async () => {
      const commitmentsTotalMax = "99,99";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?commitmentsTotalMax=${commitmentsTotalMax}`,
      );
      expect(response.body.message).toMatch(/commitmentsTotalMax: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when the specified maximum is less than the specified minimum", async () => {
      const commitmentsTotalMin = "100000000";
      const commitmentsTotalMax = "10";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?commitmentsTotalMin=${commitmentsTotalMin}&commitmentsTotalMax=${commitmentsTotalMax}`,
      );
      expect(response.body.message).toMatch(/min amount should be/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(capitalProjectRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get("/capital-projects")
        .expect(500);

      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });

    it("should 200 and return both mapped and unmapped capital projects when no isMapped value is provided", async () => {
      const response = await request(app.getHttpServer()).get(
        `/capital-projects`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(9);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 200 and return only capital projects with non-null geometries when isMapped is true", async () => {
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?isMapped=true`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(4);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 200 and return only capital projects in a geometry when a valid point is provided", async () => {
      const geometry = "Point";
      const lons = -74.010521;
      const lats = 40.708219;
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?geometry=${geometry}&lons=${lons}&lats=${lats}`,
      );
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(0);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("distance, managingCode, capitalProjectId");
    });

    it("should 200 and return only capital projects in a geometry when a valid point and buffer are provided", async () => {
      const geometry = "Point";
      const lons = -74.010521;
      const lats = 40.708219;
      const buffer = 1e6;
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?geometry=${geometry}&lons=${lons}&lats=${lats}&buffer=${buffer}`,
      );
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(3);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("distance, managingCode, capitalProjectId");
    });

    it("should 400 when an invalid geometry type is provided", async () => {
      const geometry = "Pretzel";
      const lons = -74.010521;
      const lats = 40.708219;
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?geometry=${geometry}&lons=${lons}&lats=${lats}`,
      );
      expect(response.body.message).toMatch(/geometry: Invalid enum value/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when a geometry is provided without coordinates", async () => {
      const geometry = "Point";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?geometry=${geometry}`,
      );
      expect(response.body.message).toMatch(
        /must provide latitude and longitude with geometry/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when coordinates are provided without a geometry", async () => {
      const lons = -74.010521;
      const lats = 40.708219;
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?lons=${lons}&lats=${lats}`,
      );
      expect(response.body.message).toMatch(
        /must provide with geometry with lons, lats, and buffer parameters/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when a buffer is provided without a geometry", async () => {
      const buffer = 1e6;
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?buffer=${buffer}`,
      );
      expect(response.body.message).toMatch(
        /must provide with geometry with lons, lats, and buffer parameters/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when a point is provided with more than one coordinate", async () => {
      const geometry = "Point";
      const lons = "-74.010521,-74.010521";
      const lats = "40.708219,40.708219";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?geometry=${geometry}&lons=${lons}&lats=${lats}`,
      );
      expect(response.body.message).toMatch(
        /lons: Array must contain at most 1 element/,
      );
      expect(response.body.message).toMatch(
        /lats: Array must contain at most 1 element/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 200 and return only capital projects with null geometries when isMapped is false", async () => {
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?isMapped=false`,
      );

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        response.body,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(5);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should 400 when isMapped is a non-boolean value", async () => {
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?isMapped=123`,
      );
      expect(response.body.message).toMatch(/invalid value for boolean/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when both a city council district id and isMapped are provided", async () => {
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?cityCouncilDistrictId=50&isMapped=true`,
      );
      expect(response.body.message).toMatch(
        /cannot have isMapped filter in conjunction/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when both a community district id and isMapped are provided", async () => {
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?communityDistrictId=101&isMapped=true`,
      );
      expect(response.body.message).toMatch(
        /cannot have isMapped filter in conjunction/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when both a geometry and isMapped are provided", async () => {
      const geometry = "Point";
      const lons = "-74.010521";
      const lats = "40.708219";
      const response = await request(app.getHttpServer()).get(
        `/capital-projects?geometry=${geometry}&lons=${lons}&lats=${lats}&isMapped=false`,
      );
      expect(response.body.message).toMatch(
        /cannot have isMapped filter in conjunction with other geographic filter/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });
  });

  describe("findCapitalProjectManagingAgencies", () => {
    it("should 200 and return capital project managing agencies", async () => {
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/managing-agencies`)
        .expect(200);
      expect(() =>
        findCapitalProjectManagingAgenciesQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(capitalProjectRepositoryMock, "findManagingAgencies")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/managing-agencies`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findByManagingCodeCapitalProjectId", () => {
    it("should 200 and return a capital project with budget details", async () => {
      const capitalProjectMock =
        capitalProjectRepositoryMock.findByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}`)
        .expect(200);

      expect(() =>
        findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by a too long managing code", async () => {
      const tooLongManagingCode = "1234";
      const capitalProjectId = "ABCD";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${tooLongManagingCode}/${capitalProjectId}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a lettered managing code", async () => {
      const letteredManagingCode = "ABC";
      const capitalProjectId = "ABCD";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${letteredManagingCode}/${capitalProjectId}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing managing code and capital project id", async () => {
      const managingCode = "123";
      const capitalProjectId = "ABCD";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}`)
        .expect(404);

      expect(response.body.message).toMatch(/capital project/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          capitalProjectRepositoryMock,
          "findByManagingCodeCapitalProjectId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const capitalProjectMock =
        capitalProjectRepositoryMock.findByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findGeoJsonByManagingCodeCapitalProjectId", () => {
    it("should 200 and return a capital project with budget details", async () => {
      const capitalProjectGeoJsonMock =
        capitalProjectRepositoryMock
          .findGeoJsonByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectGeoJsonMock;
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}/geojson`)
        .expect(200);

      expect(() =>
        findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by a too long managing code", async () => {
      const tooLongManagingCode = "1234";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${tooLongManagingCode}/${capitalProjectId}/geojson`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a lettered managing code", async () => {
      const letteredManagingCode = "ABC";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${letteredManagingCode}/${capitalProjectId}/geojson`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing managing code and capital project id", async () => {
      const managingCode = "123";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}/geojson`)
        .expect(404);

      expect(response.body.message).toMatch(/capital project/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          capitalProjectRepositoryMock,
          "findGeoJsonByManagingCodeCapitalProjectId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const capitalProjectMock =
        capitalProjectRepositoryMock
          .findGeoJsonByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}/geojson`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findFills", () => {
    it("should return pbf files when passing valid viewport", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 when finding a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect(400);

      expect(response.body.message).toMatch(/z: Expected number/);
      expect(response.body.message).toMatch(/x: Expected number/);
      expect(response.body.message).toMatch(/y: Expected number/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(capitalProjectRepositoryMock, "findTiles")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findCapitalCommitmentsByManagingCodeCapitalProjectId", () => {
    it("should 200 and return an array of capital commitments", async () => {
      const capitalProjectMock =
        capitalProjectRepositoryMock.capitalProjectGroups[0][0];

      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${managingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(200);

      expect(() =>
        findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by a too long managing code", async () => {
      const tooLongManagingCode = "0725";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${tooLongManagingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a lettered managing code", async () => {
      const letteredManagingCode = "FUJI";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${letteredManagingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing managing code and capital project id", async () => {
      const missingManagingCode = "567";
      const missingCapitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${missingManagingCode}/${missingCapitalProjectId}/capital-commitments`,
        )
        .expect(404);

      expect(response.body.message).toMatch(/capital project for commitments/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          capitalProjectRepositoryMock,
          "findCapitalCommitmentsByManagingCodeCapitalProjectId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const capitalProjectMock =
        capitalProjectRepositoryMock.capitalProjectGroups[0][0];

      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${managingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });
});
