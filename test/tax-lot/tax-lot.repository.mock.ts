import { generateMock } from "@anatine/zod-mock";
import {
  CheckTaxLotByBblRepoSchema,
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";
import { ZoningDistrictEntitySchema } from "src/schema/zoning-district";
import {
  checkTaxLotByBblRepoSchema,
  findZoningDistrictByTaxLotBblRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  checkTaxLotByBblMocks = Array.from(Array(2), () =>
    generateMock(checkTaxLotByBblRepoSchema, { seed: 1 }),
  );

  async checkTaxLotByBbl(bbl: string) {
    return this.checkTaxLotByBblMocks.find((row) => row.bbl === bbl);
  }

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

  findZoningDistrictByTaxLotBblMocks: Array<
    [CheckTaxLotByBblRepoSchema, Array<ZoningDistrictEntitySchema>]
  > = this.checkTaxLotByBblMocks.map((taxLot) => {
    return [taxLot, generateMock(findZoningDistrictByTaxLotBblRepoSchema)];
  });

  async findZoningDistrictByBbl(bbl: string) {
    const results = this.findZoningDistrictByTaxLotBblMocks.find(
      ([taxLot]) => taxLot.bbl === bbl,
    );
    return results === undefined ? results : results[1];
  }
}
