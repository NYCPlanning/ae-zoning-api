import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { BoroughRepository } from "src/borough/borough.repository";
import { BoroughRepositoryMock } from "./borough.repository.mock";
import { BoroughModule } from "src/borough/borough.module";
import {
  findBoroughsQueryResponseSchema,
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
} from "src/gen";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";

describe("Borough e2e", () => {
  let app: INestApplication;

  const boroughRepositoryMock = new BoroughRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BoroughModule],
    })
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
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

  afterAll(async () => {
    await app.close();
  });
});
