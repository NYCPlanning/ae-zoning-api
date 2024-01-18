import { generateMock } from "@anatine/zod-mock";
import { findAllRepoSchema } from "src/zoning-district-class/zoning-district-class.repository.schema";

export class ZoningDistrictClassRepositoryMock {
  findAllMocks = generateMock(findAllRepoSchema);

  findAll() {
    return this.findAllMocks;
  }
}
