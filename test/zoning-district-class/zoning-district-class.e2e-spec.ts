import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZoningDistrictClassModule } from "src/zoning-district-class/zoning-district-class.module";
import { ZoningDistrictClassRepositoryMock } from "./zoning-district-class.repository.mock";
import { ZoningDistrictClassRepository } from "src/zoning-district-class/zoning-district-class.repository";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import {
  findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema,
  findZoningDistrictClassCategoryColorsQueryResponseSchema,
  findZoningDistrictClassesQueryResponseSchema,
} from "src/gen";

describe("Zoning District Classes e2e", () => {
  let app: INestApplication;

  const zoningDistrictClassRepositoryMock =
    new ZoningDistrictClassRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ZoningDistrictClassModule],
    })
      .overrideProvider(ZoningDistrictClassRepository)
      .useValue(zoningDistrictClassRepositoryMock)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findZoningDistrictClasses", () => {
    it("should 200 and return all zoning district classes", async () => {
      const response = await request(app.getHttpServer())
        .get("/zoning-district-classes")
        .expect(200);

      expect(() =>
        findZoningDistrictClassesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 and throw data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(zoningDistrictClassRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get("/zoning-district-classes")
        .expect(500);

      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findZoningDistrictClassByZoningDistrictClassId", () => {
    it("should 200 and return zoning district class(es) by zoning district id", async () => {
      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];

      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${mock.id}`)
        .expect(200);

      expect(() =>
        findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 200 and return a zoning district class by lowercase id", async () => {
      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];
      const lowerCaseId = mock.id.toLowerCase();

      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${lowerCaseId}`)
        .expect(200);

      expect(() =>
        findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 and throw 'Bad Request' error with an invalid id", async () => {
      const invalidId = "CC";
      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${invalidId}`)
        .expect(400);

      expect(response.body.message).toMatch(/id: Invalid/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 and throw 'Not Found' with an missing id", async () => {
      const missingId = "T1";
      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${missingId}`)
        .expect(404);

      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 and throw data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(zoningDistrictClassRepositoryMock, "findById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${mock.id}`)
        .expect(500);

      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findZoningDistrictClassCategoryColors", () => {
    it("should 200 and return zoning district class category colors", async () => {
      const response = await request(app.getHttpServer())
        .get("/zoning-district-classes/category-colors")
        .expect(200);

      expect(() =>
        findZoningDistrictClassCategoryColorsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 500 and throw data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(zoningDistrictClassRepositoryMock, "findCategoryColors")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get("/zoning-district-classes/category-colors")
        .expect(500);

      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
