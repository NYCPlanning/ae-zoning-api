import { generateMock } from "@anatine/zod-mock";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictByTaxLotBblRepoSchema,
  checkTaxLotByBblRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  checkTaxLotByBblMocks = [
    generateMock(checkTaxLotByBblRepoSchema, { seed: 1 }),
  ];

  async checkTaxLotByBbl(bbl: string) {
    return this.checkTaxLotByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblMocks = Array.from(Array(1), () =>
    generateMock(findByBblRepoSchema, {
      stringMap: {
        bbl: () => this.checkTaxLotByBblMocks[0].bbl,
      },
    }),
  );

  async findByBbl(bbl: string) {
    return this.findByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblSpatialMocks = Array.from(Array(1), () =>
    generateMock(findByBblSpatialRepoSchema, {
      stringMap: {
        bbl: () => this.findByBblMocks[0].bbl,
      },
    }),
  );

  async findByBblSpatial(bbl: string) {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }

  findZoningDistrictByTaxLotBblMocks = this.checkTaxLotByBblMocks.map(
    (checkTaxLotByBblMock) => {
      return {
        [checkTaxLotByBblMock.bbl]: generateMock(
          findZoningDistrictByTaxLotBblRepoSchema,
        ),
      };
    },
  );

  async findZoningDistrictByBbl(bbl: string) {
    const results = this.findZoningDistrictByTaxLotBblMocks.find(
      (taxLotZoningDistrictsPair) => bbl in taxLotZoningDistrictsPair,
    );
    return results === undefined ? results : results[bbl];
  }
}
