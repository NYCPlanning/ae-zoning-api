import { findManyRepoSchema } from "src/borough/borough.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class BoroughRepositoryMock {
  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }
}
