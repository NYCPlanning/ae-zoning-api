import { generateMock } from "@anatine/zod-mock";
import {
  findAllRepoSchema,
  findByIdRepoSchema,
  findCategoryColorsRepoSchema,
} from "src/zoning-district-class/zoning-district-class.repository.schema";

export class ZoningDistrictClassRepositoryMock {
  findAllMocks = generateMock(findAllRepoSchema);

  findByIdMocks = Array.from(Array(10), () =>
    generateMock(findByIdRepoSchema, { seed: 1 }),
  );

  findCategoryColorsMocks = generateMock(findCategoryColorsRepoSchema, {
    seed: 1,
  });

  findAll() {
    return this.findAllMocks;
  }

  async findById(id: string) {
    return this.findByIdMocks.find((row) => row.id === id);
  }

  async findCategoryColors() {
    return this.findCategoryColorsMocks;
  }
}
