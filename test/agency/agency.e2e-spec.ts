import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { AgencyRepository } from "src/agency/agency.repository";
import { AgencyRepositoryMock } from "./agency.repository.mock";
import { AgencyModule } from "src/agency/agency.module";
import { findAgenciesQueryResponseSchema } from "src/gen";

describe("Agency e2e", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AgencyModule],
    })
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findAgencies", () => {
    it("should 200 and return all agencies", async () => {
      const response = await request(app.getHttpServer())
        .get(`/agencies`)
        .expect(200);
      expect(() =>
        findAgenciesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(agencyRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/agencies`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
