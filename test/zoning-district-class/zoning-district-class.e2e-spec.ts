import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZoningDistrictClassModule } from "src/zoning-district-class/zoning-district-class.module";
import { ZoningDistrictClassRepositoryMock } from "./zoning-district-class.repository.mock";
import { ZoningDistrictClassRepository } from "src/zoning-district-class/zoning-district-class.repository";
import {
  getAllZoningDistrictClassesQueryResponseSchema,
  getZoningDistrictClassesByIdQueryResponseSchema,
} from "src/gen";
import {
  DataRetrievalException,
  InvalidRequestParameterException,
} from "src/exception";
import { HttpName } from "src/filter";

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

  describe("getAllZoningDistrictClasses", () => {
    it("should 200 and return all zoning district classes", async () => {
      const response = await request(app.getHttpServer())
        .get("/zoning-district-classes")
        .expect(200);

      expect(() =>
        getAllZoningDistrictClassesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 and throw data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(zoningDistrictClassRepositoryMock, "findAll")
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

  describe("getZoningDistrictClassesById", () => {
    it("should 200 and return a zoning district class by id", async () => {
      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];

      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${mock.id}`)
        .expect(200);

      expect(() =>
        getZoningDistrictClassesByIdQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 400 and throw 'Bad Request' error with an invalid id", async () => {
      const invalidRequestParameterException =
        new InvalidRequestParameterException();

      const invalidId = "CC";
      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${invalidId}`)
        .expect(400);

      expect(response.body.message).toBe(
        invalidRequestParameterException.message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 and throw 'Not Found' with an missing id", async () => {
      const missingId = "C1";
      const response = await request(app.getHttpServer())
        .get(`/zoning-district-classes/${missingId}`)
        .expect(404);

      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 and throw data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException();
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

  afterAll(async () => {
    await app.close();
  });
});
