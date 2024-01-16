import { generateMock } from "@anatine/zod-mock";
import { findByBblSpatialSchema } from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  findByBblSpatialMocks = Array.from(Array(10), () =>
    generateMock(findByBblSpatialSchema, { seed: 1 }),
  );

  findByBblSpatial(bbl: string) {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }
}
