import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { AgencyBudgetRepositoryMock } from "./agency-budget.repository.mock";
import { Test } from "@nestjs/testing";
import { AgencyBudgetModule } from "src/agency-budget/agency-budget.module";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import { findAgencyBudgetsQueryResponseSchema } from "src/gen";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";

describe("Agency Budget e2e", () => {
  let app: INestApplication;

  const agencyBudgetRepositoryMock = new AgencyBudgetRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AgencyBudgetModule],
    })
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("findMany", () => {
    it("should 200 and return all agency budgets", async () => {
      const response = await request(app.getHttpServer())
        .get("/agency-budgets")
        .expect(200);
      expect(() =>
        findAgencyBudgetsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(agencyBudgetRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get("/agency-budgets")
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });
});
