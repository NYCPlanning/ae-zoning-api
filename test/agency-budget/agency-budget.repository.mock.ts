import { generateMock } from "@anatine/zod-mock";
import { findManyRepoSchema } from "src/agency-budget/agency-budget.repository.schema";

export class AgencyBudgetRepositoryMock {
  findManyMocks = generateMock(findManyRepoSchema);

  async checkByCode(code: string) {
    return this.findManyMocks.some((row) => row.code === code);
  }

  async findMany() {
    return this.findManyMocks;
  }
}
