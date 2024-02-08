import { generateMock } from "@anatine/zod-mock";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictsByBblRepoSchema,
  checkByBblRepoSchema,
  findZoningDistrictClassesByBblRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  numberOfMocks = 1;

  checkByBblMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkByBblRepoSchema, { seed: seed + 1 }),
  );

  async checkByBbl(bbl: string) {
    return this.checkByBblMocks.find((row) => row.bbl === bbl);
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

  findZoningDistrictByTaxLotBblMocks = this.checkByBblMocks.map(
    (checkTaxLot) => {
      return {
        [checkTaxLot.bbl]: generateMock(findZoningDistrictsByBblRepoSchema),
      };
    },
  );

  async findZoningDistrictsByBbl(bbl: string) {
    const results = this.findZoningDistrictByTaxLotBblMocks.find(
      (taxLotZoningDistrictsPair) => bbl in taxLotZoningDistrictsPair,
    );
    return results === undefined ? [] : results[bbl];
  }

  findZoningDistrictClassByTaxLotBblMocks = this.checkByBblMocks.map(
    (checkTaxLot) => {
      return {
        [checkTaxLot.bbl]: generateMock(
          findZoningDistrictClassesByBblRepoSchema,
        ),
      };
    },
  );

  async findZoningDistrictClassesByBbl(bbl: string) {
    const results = this.findZoningDistrictClassByTaxLotBblMocks.find(
      (taxLotZoningDistrictClasses) => bbl in taxLotZoningDistrictClasses,
    );
    return results === undefined ? [] : results[bbl];
  }
}
