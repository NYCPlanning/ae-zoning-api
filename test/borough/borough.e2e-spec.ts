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
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
} from "src/gen";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";

describe("Borough e2e", () => {
  let app: INestApplication;

  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BoroughModule],
    })
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
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
      const dataRetrievalException = new DataRetrievalException();
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
      const mock = boroughRepositoryMock.checkBoroughByIdMocks[0];

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

    it("should 404 and when finding by a missing id", async () => {
      const missingId = "9";
      const response = await request(app.getHttpServer())
        .get(`/boroughs/${missingId}/community-districts`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(boroughRepositoryMock, "checkBoroughById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const mock = boroughRepositoryMock.checkBoroughByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/boroughs/${mock.id}/community-districts`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCapitalProjectsByBoroughIdCommunityDistrictId", () => {
    const borough = boroughRepositoryMock.checkBoroughByIdMocks[0];
    const communityDistrict =
      communityDistrictRepositoryMock.checkCommunityDistrictByIdMocks[0];
    it("should 200 and return capital projects for a given borough id community district id", async () => {
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${borough.id}/community-districts/${communityDistrict.id}/capital-projects`,
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
          `/boroughs/${borough.id}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}&offset=${offset}`,
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

    it("should 404 and when finding by a missing borough id", async () => {
      const missingId = "9";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${missingId}/community-districts/${communityDistrict.id}/capital-projects`,
        )
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 404 and when finding by a missing community district id", async () => {
      const missingId = "99";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${borough.id}/community-districts/${missingId}/capital-projects`,
        )
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
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
          `/boroughs/${borough.id}/community-districts/${invalidId}/capital-projects`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid limit", async () => {
      const limit = "b4d";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${borough.id}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by too high a limit", async () => {
      const limit = 101;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${borough.id}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid limit", async () => {
      const limit = 0;
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${borough.id}/community-districts/${communityDistrict.id}/capital-projects?limit=${limit}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid offset", async () => {
      const offset = "b4d";
      const response = await request(app.getHttpServer())
        .get(
          `/boroughs/${borough.id}/community-districts/${communityDistrict.id}/capital-projects?offset=${offset}`,
        )
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(boroughRepositoryMock, "checkBoroughById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const boroughId = boroughRepositoryMock.checkBoroughByIdMocks[0].id;
      const response = await request(app.getHttpServer())
        .get(`/boroughs/${boroughId}/community-districts/01/capital-projects`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
