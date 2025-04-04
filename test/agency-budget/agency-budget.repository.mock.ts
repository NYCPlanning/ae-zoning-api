import { generateMock } from "@anatine/zod-mock";
import {
  CheckByCodeRepo,
  FindManyRepo,
} from "src/agency-budget/agency-budget.repository.schema";
import { agencyBudgetEntitySchema } from "src/schema";

export class AgencyBudgetRepositoryMock {
  agencyBudgets = Array.from(Array(2), (_, index) =>
    generateMock(agencyBudgetEntitySchema, { seed: index + 1 }),
  );

  async checkByCode(code: string): Promise<CheckByCodeRepo> {
    return this.agencyBudgets.some((row) => row.code === code);
  }

  async findMany(): Promise<FindManyRepo> {
    return this.agencyBudgets;
  }
}
