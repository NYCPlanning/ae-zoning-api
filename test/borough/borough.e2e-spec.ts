import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { BoroughRepository } from "src/borough/borough.repository";
import { BoroughRepositoryMock } from "./borough.repository.mock";
import { BoroughModule } from "src/borough/borough.module";
import { findBoroughsQueryResponseSchema } from "src/gen";
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

  afterAll(async () => {
    await app.close();
  });
});
