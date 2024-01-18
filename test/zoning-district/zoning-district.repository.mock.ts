import { findByUuidRepoSchema } from "src/zoning-district/zoning-district.repository.schema";
import { generateMock } from "@anatine/zod-mock";

export class ZoningDistrictRepositoryMock {
  findByUuidMocks = Array.from(Array(10), () =>
    generateMock(findByUuidRepoSchema, { seed: 1 }),
  );

  async findByUuid(id: string) {
    return this.findByUuidMocks.find((row) => row.id === id);
  }
}
