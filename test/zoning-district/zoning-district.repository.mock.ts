import {
  checkByIdRepoSchema,
  findByIdRepoSchema,
  findZoningDistrictClassesByIdRepoSchema,
} from "src/zoning-district/zoning-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class ZoningDistrictRepositoryMock {
  numberOfMocks = 1;

  checkByIdMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkByIdRepoSchema, { seed: seed + 1 }),
  );

  async checkById(id: string) {
    return this.checkByIdMocks.find((row) => row.id === id);
  }

  findByIdMocks = Array.from(Array(10), () =>
    generateMock(findByIdRepoSchema, { seed: 1 }),
  );

  async findById(id: string) {
    return this.findByIdMocks.find((row) => row.id === id);
  }

  findZoningDistrictClassesByIdMocks = this.checkByIdMocks.map(
    (checkZoningDistrict) => {
      return {
        [checkZoningDistrict.id]: generateMock(
          findZoningDistrictClassesByIdRepoSchema,
        ),
      };
    },
  );

  async findZoningDistrictClassesById(id: string) {
    const results = this.findZoningDistrictClassesByIdMocks.find(
      (zoningDistrictClassesPair) => id in zoningDistrictClassesPair,
    );

    return results === undefined ? [] : results[id];
  }
}
