import {
  checkByIdRepoSchema,
  findByUuidRepoSchema,
  findClassesByIdRepoSchema,
} from "src/zoning-district/zoning-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class ZoningDistrictRepositoryMock {
  numberOfMocks = 1;

  checkZoningDistrictsByIdMocks = Array.from(
    Array(this.numberOfMocks),
    (_, seed) => generateMock(checkByIdRepoSchema, { seed: seed + 1 }),
  );

  async checkZoningDistrictById(id: string) {
    return this.checkZoningDistrictsByIdMocks.find((row) => row.id === id);
  }

  findByUuidMocks = Array.from(Array(10), () =>
    generateMock(findByUuidRepoSchema, { seed: 1 }),
  );

  async findByUuid(id: string) {
    return this.findByUuidMocks.find((row) => row.id === id);
  }

  findClassesByUuidMocks = this.checkZoningDistrictsByIdMocks.map(
    (checkZoningDistrict) => {
      return {
        [checkZoningDistrict.id]: generateMock(findClassesByIdRepoSchema),
      };
    },
  );

  async findClassesByUuid(id: string) {
    const results = this.findClassesByUuidMocks.find(
      (zoningDistrictClassesPair) => id in zoningDistrictClassesPair,
    );

    return results === undefined ? [] : results[id];
  }
}
