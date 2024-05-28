import { findManyRepoSchema } from "src/city-council-district/city-council-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class CityCouncilDistrictRepositoryMock {
  findManyMocks = generateMock(findManyRepoSchema);

  async findMany() {
    return this.findManyMocks;
  }
}
