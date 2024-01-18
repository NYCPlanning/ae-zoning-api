import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ZoningDistrictClassModule } from "src/zoning-district-class/zoning-district-class.module";
import { ZoningDistrictClassRepositoryMock } from "./zoning-district-class.repository.mock";
import { ZoningDistrictClassRepository } from "src/zoning-district-class/zoning-district-class.repository";
import { getAllZoningDistrictClassesQueryResponseSchema } from "src/gen";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";

describe("Zoning District Classes e2e", () => {
  let app: INestApplication;

  const zoningDistrictClassRepostoryMock =
    new ZoningDistrictClassRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ZoningDistrictClassModule],
    })
      .overrideProvider(ZoningDistrictClassRepository)
      .useValue(zoningDistrictClassRepostoryMock)
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

    it("should 500 and return data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(zoningDistrictClassRepostoryMock, "findAll")
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

  afterAll(async () => {
    await app.close();
  });
});
