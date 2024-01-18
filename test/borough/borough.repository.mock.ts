import { findAllRepoSchema } from "src/borough/borough.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class BoroughRepositoryMock {
  findAllMocks = generateMock(findAllRepoSchema);

  async findAll() {
    return this.findAllMocks;
  }
}
