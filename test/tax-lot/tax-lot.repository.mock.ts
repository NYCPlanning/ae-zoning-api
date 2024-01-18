import { generateMock } from "@anatine/zod-mock";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  findByBblMocks = Array.from(Array(10), () =>
    generateMock(findByBblRepoSchema, { seed: 1 }),
  );

  async findByBbl(bbl: string) {
    return this.findByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblSpatialMocks = Array.from(Array(10), () =>
    generateMock(findByBblSpatialRepoSchema, { seed: 1 }),
  );

  async findByBblSpatial(bbl: string) {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }
}
