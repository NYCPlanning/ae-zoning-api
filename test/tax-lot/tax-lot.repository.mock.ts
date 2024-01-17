import { generateMock } from "@anatine/zod-mock";
import { findByBblSpatialRepoSchema } from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  findByBblSpatialMocks = Array.from(Array(10), () =>
    generateMock(findByBblSpatialRepoSchema, { seed: 1 }),
  );

  async findByBblSpatial(bbl: string) {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }
}
