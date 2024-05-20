import { findManyRepoSchema } from "src/agency/agency.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class AgencyRepositoryMock {
  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }
}
