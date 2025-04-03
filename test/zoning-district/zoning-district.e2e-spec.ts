import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZoningDistrictRepositoryMock } from "./zoning-district.repository.mock";
import { ZoningDistrictRepository } from "src/zoning-district/zoning-district.repository";
import {
  findZoningDistrictByZoningDistrictIdQueryResponseSchema,
  findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema,
} from "src/gen";
import { ZoningDistrictModule } from "src/zoning-district/zoning-district.module";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";

describe("Zoning district e2e", () => {
  let app: INestApplication;

  const zoningDistrictRepositoryMock = new ZoningDistrictRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ZoningDistrictModule],
    })
      .overrideProvider(ZoningDistrictRepository)
      .useValue(zoningDistrictRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findZoningDistrictByZoningDistrictId", () => {
    it("should 200 and return zoning district", async () => {
      const mock = zoningDistrictRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${mock.id}`)
        .expect(200);
      expect(() =>
        findZoningDistrictByZoningDistrictIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 and when finding by a too short id", async () => {
      const shortId = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6";
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${shortId}`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 and when finding by a missing id", async () => {
      const missingId = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${missingId}`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(zoningDistrictRepositoryMock, "findById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const mock = zoningDistrictRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${mock.id}`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findZoningDistrictClassesByZoningDistrictId", () => {
    it("should 200 and return a zoning district class for a given id", async () => {
      const mock = zoningDistrictRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${mock.id}/classes`)
        .expect(200);
      expect(() =>
        findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 and when finding by a too short id", async () => {
      const shortId = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6";
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${shortId}/classes`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 and when finding by a missing id", async () => {
      const missingId = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${missingId}/classes`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(zoningDistrictRepositoryMock, "checkById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const mock = zoningDistrictRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/zoning-districts/${mock.id}/classes`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
