import { findAllRepoSchema } from "src/land-use/land-use.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class LandUseRepositoryMock {
  findAllMocks = generateMock(findAllRepoSchema);

  async findAll() {
    return this.findAllMocks;
  }
}
