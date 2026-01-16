import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { BoroughRepository } from "src/borough/borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { BoroughRepositoryMock } from "./borough.repository.mock";
import { CommunityDistrictRepositoryMock } from "../community-district/community-district.repository.mock";
import { BoroughModule } from "src/borough/borough.module";
import {
  findBoroughsQueryResponseSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema,
  findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponseSchema,
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
} from "src/gen";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";

describe("Borough e2e", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const agencyBudgetRepositoryMock = new AgencyBudgetRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );
  const capitalProjectRepositoryMock = new CapitalProjectRepositoryMock(
    agencyRepositoryMock,
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
    agencyBudgetRepositoryMock,
  );

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BoroughModule],
    })
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepositoryMock)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findBoroughs", () => {
    it("should 200 and return all boroughs", async () => {
      const response = await request(app.getHttpServer())
        .get(`/boroughs`)
        .expect(200);
      expect(() =>
        findBoroughsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 and return all boroughs", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(boroughRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/boroughs`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findCommunityDistrictsByBoroughId", () => {
    it("should 200 and return community districts for a given borough id", async () => {
      const mock = boroughRepositoryMock.boroughs[0];

      const response = await request(app.getHttpServer())
        .get(`/boroughs/${mock.id}/community-districts`)
        .expect(200);

      expect(() => {
        findCommunityDistrictsByBoroughIdQueryResponseSchema.parse(
          response.body,
        );
      }).not.toThrow();
    });

    it("should 400 and when finding by an invalid id", async () => {
      const invalidId = "MN";
      const response = await request(app.getHttpServer())
        .get(`/boroughs/${invalidId}/community-districts`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by a missing id", async () => {
      const missingId = "9";
      const response = await request(app.getHttpServer())
        .get(`/boroughs/${missingId}/community-districts`)
        .expect(404);
      expect(response.body.message).toMatch(/borough for community districts/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(boroughRepositoryMock, "checkById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const mock = boroughRepositoryMock.boroughs[0];
      const response = await request(app.getHttpServer())
        .get(`/boroughs/${mock.id}/community-districts`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks", () => {
    it("should 200 and return documented schema when finding by valid id", async () => {
      const mock =
        boroughRepositoryMock
          .findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${mock.boroughId}/community-districts/${mock.id}/geojson`,
        )
        .expect(200);
      expect(() =>
        findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by too long id", async () => {
      const longId = "100";
      const response = await request(app.getHttpServer())
        .get(`/boroughs/1/community-districts/${longId}/geojson`)
        .expect(400);
      expect(response.body.message).toMatch(/communityDistrictId: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by lettered id", async () => {
      const letterId = "Y";
      const response = await request(app.getHttpServer())
        .get(`/boroughs/1/community-districts/${letterId}/geojson`)
        .expect(400);
      expect(response.body.message).toMatch(/communityDistrictId: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing id", async () => {
      const missingId = "00";
      const response = await request(app.getHttpServer())
        .get(`/boroughs/1/community-districts/${missingId}/geojson`)
        .expect(404);
      expect(response.body.message).toMatch(/community district geojson/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          boroughRepositoryMock,
          "findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock =
        boroughRepositoryMock
          .findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${mock.boroughId}/community-districts/${mock.id}/geojson`,
        )
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findCapitalProjectsByBoroughIdCommunityDistrictId", () => {
    const communityDistrict = communityDistrictRepositoryMock.districts[0];
    it("should 200 and return capital projects for a given borough id community district id", async () => {
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects`,
        )
        .expect(200);

      expect(() => {
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          response.body,
        );
      }).not.toThrow();

      const parsedBody =
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
    });

    it("should 200 and return capital projects for a given borough id community district id with user specified offset and limit", async () => {
      const limit = 10;
      const offset = 3;

      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}&offset=${offset}`,
        )
        .expect(200);

      expect(() => {
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          response.body,
        );
      }).not.toThrow();

      const parsedBody =
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(10);
      expect(parsedBody.offset).toBe(3);
    });

    it("should 400 and when finding by a missing borough id", async () => {
      const missingId = "9";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${missingId}/community-districts/${communityDistrict.id}/capital-projects`,
        )
        .expect(400);
      expect(response.body.message).toMatch(/invalid borough id/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by a missing community district id", async () => {
      const missingId = "99";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${missingId}/capital-projects`,
        )
        .expect(400);
      expect(response.body.message).toMatch(/could not check/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid borough id", async () => {
      const invalidId = "MN";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${invalidId}/community-districts/${communityDistrict.id}/capital-projects`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid community district id", async () => {
      const invalidId = "Q1";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${invalidId}/capital-projects`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid limit", async () => {
      const limit = "b4d";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by too high a limit", async () => {
      const limit = 101;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid limit", async () => {
      const limit = 0;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid offset", async () => {
      const offset = "b4d";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects?offset=${offset}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          boroughRepositoryMock.communityDistrictRepoMock,
          "checkByBoroughIdCommunityDistrictId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/01/capital-projects`,
        )
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCapitalProjectTilesByBoroughIdCommunityDistrictId", () => {
    const communityDistrict = communityDistrictRepositoryMock.districts[0];

    it("should 200 and return capital project tiles for a given borough id and community district id", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 and when finding by an invalid borough id", async () => {
      const invalidId = "MN";

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${invalidId}/community-districts/${communityDistrict.id}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toMatch(/boroughId: Invalid/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid community district id", async () => {
      const invalidId = "Q1";

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${invalidId}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toMatch(/communityDistrictId: Invalid/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toMatch(/z: Expected number/);
      expect(response.body.message).toMatch(/x: Expected number/);
      expect(response.body.message).toMatch(/y: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          boroughRepositoryMock,
          "findCapitalProjectTilesByBoroughIdCommunityDistrictId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId", () => {
    const communityDistrict = communityDistrictRepositoryMock.districts[0];

    it("should 200 and return community board budget request tiles for a given borough id and community district id", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/community-board-budget-requests/${z}/${x}/${y}.pbf`,
        )
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 and when finding by an invalid borough id", async () => {
      const invalidId = "MN";

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${invalidId}/community-districts/${communityDistrict.id}/community-board-budget-requests/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toMatch(/boroughId: Invalid/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid community district id", async () => {
      const invalidId = "Q1";

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${invalidId}/community-board-budget-requests/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toMatch(/communityDistrictId: Invalid/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/community-board-budget-requests/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toMatch(/z: Expected number/);
      expect(response.body.message).toMatch(/x: Expected number/);
      expect(response.body.message).toMatch(/y: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(
          boroughRepositoryMock,
          "findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${communityDistrict.boroughId}/community-districts/${communityDistrict.id}/community-board-budget-requests/${z}/${x}/${y}.pbf`,
        )
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
