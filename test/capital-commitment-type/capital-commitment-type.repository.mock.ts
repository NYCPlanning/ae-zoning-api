import { findManyRepoSchema } from "src/capital-commitment-type/capital-commitment-type.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class CapitalCommitmentTypeRepositoryMock {
  findAllMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findAllMocks;
  }
}
