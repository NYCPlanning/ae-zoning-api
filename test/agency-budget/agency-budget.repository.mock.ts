import { generateMock } from "@anatine/zod-mock";
import {
  checkByCodeRepoSchema,
  findManyRepoSchema,
} from "src/agency-budget/agency-budget.repository.schema";

export class AgencyBudgetRepositoryMock {
  numberOfMocks = 2;

  checkByCodeMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkByCodeRepoSchema, { seed: seed + 1 }),
  );

  async checkByCode(code: string) {
    return this.checkByCodeMocks.find((row) => row.code === code);
  }

  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }
}
