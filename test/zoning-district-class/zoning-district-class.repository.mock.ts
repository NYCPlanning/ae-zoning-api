import { generateMock } from "@anatine/zod-mock";
import {
  findByIdRepoSchema,
  findCategoryColorsRepoSchema,
  findManyRepoSchema,
} from "src/zoning-district-class/zoning-district-class.repository.schema";

export class ZoningDistrictClassRepositoryMock {
  findManyMocks = generateMock(findManyRepoSchema);

  findByIdMocks = Array.from(Array(10), () =>
    generateMock(findByIdRepoSchema, { seed: 1 }),
  );

  findCategoryColorsMocks = generateMock(findCategoryColorsRepoSchema, {
    seed: 1,
  });

  findMany() {
    return this.findManyMocks;
  }

  async findById(id: string) {
    return this.findByIdMocks.find((row) => row.id === id);
  }

  async findCategoryColors() {
    return this.findCategoryColorsMocks;
  }
}
