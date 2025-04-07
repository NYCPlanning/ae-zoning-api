import {
  CheckByIdRepo,
  FindByIdRepo,
  FindZoningDistrictClassesByIdRepo,
  findZoningDistrictClassesByIdRepoSchema,
} from "src/zoning-district/zoning-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";
import { zoningDistrictEntitySchema } from "src/schema";

export class ZoningDistrictRepositoryMock {
  districts = Array.from(Array(2), (_, seed) =>
    generateMock(zoningDistrictEntitySchema, { seed: seed + 1 }),
  );

  async checkById(id: string): Promise<CheckByIdRepo> {
    return this.districts.some((row) => row.id === id);
  }

  async findById(id: string): Promise<FindByIdRepo | undefined> {
    return this.districts.find((row) => row.id === id);
  }

  findZoningDistrictClassesByIdMocks = this.districts.map((district) => {
    return {
      [district.id]: generateMock(findZoningDistrictClassesByIdRepoSchema),
    };
  });

  async findZoningDistrictClassesById(
    id: string,
  ): Promise<FindZoningDistrictClassesByIdRepo> {
    const results = this.findZoningDistrictClassesByIdMocks.find(
      (zoningDistrictClassesPair) => id in zoningDistrictClassesPair,
    );

    return results === undefined ? [] : results[id];
  }
}
