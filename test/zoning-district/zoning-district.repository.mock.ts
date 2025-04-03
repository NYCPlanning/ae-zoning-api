import {
  findByIdRepoSchema,
  findZoningDistrictClassesByIdRepoSchema,
} from "src/zoning-district/zoning-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class ZoningDistrictRepositoryMock {
  findByIdMocks = Array.from(Array(10), () =>
    generateMock(findByIdRepoSchema, { seed: 1 }),
  );

  async checkById(id: string) {
    return this.findByIdMocks.some((row) => row.id === id);
  }

  async findById(id: string) {
    return this.findByIdMocks.find((row) => row.id === id);
  }

  findZoningDistrictClassesByIdMocks = this.findByIdMocks.map(
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
