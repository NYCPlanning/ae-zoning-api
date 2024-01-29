import { generateMock } from "@anatine/zod-mock";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictByTaxLotBblRepoSchema,
  checkTaxLotByBblRepoSchema,
  findZoningDistrictClassByBblRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  numberOfMocks = 1;

  checkTaxLotByBblMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkTaxLotByBblRepoSchema, { seed: seed + 1 }),
  );

  async checkTaxLotByBbl(bbl: string) {
    return this.checkTaxLotByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(findByBblRepoSchema, { seed: seed + 1 }),
  );

  async findByBbl(bbl: string) {
    return this.findByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblSpatialMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(findByBblSpatialRepoSchema, { seed: seed + 1 }),
  );

  async findByBblSpatial(bbl: string) {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }

  findZoningDistrictByTaxLotBblMocks = this.checkTaxLotByBblMocks.map(
    (checkTaxLot) => {
      return {
        [checkTaxLot.bbl]: generateMock(
          findZoningDistrictByTaxLotBblRepoSchema,
        ),
      };
    },
  );

  async findZoningDistrictByBbl(bbl: string) {
    const results = this.findZoningDistrictByTaxLotBblMocks.find(
      (taxLotZoningDistrictsPair) => bbl in taxLotZoningDistrictsPair,
    );
    return results === undefined ? [] : results[bbl];
  }

  findZoningDistrictClassByTaxLotBblMocks = this.checkTaxLotByBblMocks.map(
    (checkTaxLot) => {
      return {
        [checkTaxLot.bbl]: generateMock(findZoningDistrictClassByBblRepoSchema),
      };
    },
  );

  async findZoningDistrictClassByBbl(bbl: string) {
    const results = this.findZoningDistrictClassByTaxLotBblMocks.find(
      (taxLotZoningDistrictClasses) => bbl in taxLotZoningDistrictClasses,
    );
    return results === undefined ? [] : results[bbl];
  }
}
