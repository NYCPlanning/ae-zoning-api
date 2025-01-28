import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import { AgencyBudgetService } from "./agency-budget.service";
import { Test } from "@nestjs/testing";
import { AgencyBudgetRepository } from "./agency-budget.repository";
import { findAgencyBudgetsQueryResponseSchema } from "src/gen";

describe("AgencyBudgetService", () => {
  let agencyBudgetService: AgencyBudgetService;

  const agencyBudgetRepository = new AgencyBudgetRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AgencyBudgetService, AgencyBudgetRepository],
    })
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepository)
      .compile();

    agencyBudgetService =
      moduleRef.get<AgencyBudgetService>(AgencyBudgetService);
  });

  describe("findMany", () => {
    it("should return a findAgencyBudgetsQueryResponseSchema compliant object", async () => {
      const agencyBudgets = await agencyBudgetService.findMany();

      expect(() =>
        findAgencyBudgetsQueryResponseSchema.parse(agencyBudgets),
      ).not.toThrow();

      expect(agencyBudgets.order).toBe("code");
    });
  });
});
