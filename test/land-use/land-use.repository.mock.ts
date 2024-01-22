import { findManyRepoSchema } from "src/land-use/land-use.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class LandUseRepositoryMock {
  findAllMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findAllMocks;
  }
}
