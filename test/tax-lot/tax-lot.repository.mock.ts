import { generateMock } from "@anatine/zod-mock";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictByTaxLotBblRepoSchema,
  checkTaxLotByBblRepoSchema,
} from "src/tax-lot/tax-lot.repository.schema";

export class TaxLotRepositoryMock {
  checkTaxLotByBblMocks = Array.from(Array(1), (_, seed) =>
    generateMock(checkTaxLotByBblRepoSchema, { seed }),
  );

  async checkTaxLotByBbl(bbl: string) {
    return this.checkTaxLotByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblMocks = this.checkTaxLotByBblMocks.map((checkTaxLot) => {
    const mock = generateMock(findByBblRepoSchema);
    return {
      ...mock,
      ...checkTaxLot,
    };
  });

  async findByBbl(bbl: string) {
    return this.findByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblSpatialMocks = this.checkTaxLotByBblMocks.map((checkTaxLot) => {
    const mock = generateMock(findByBblSpatialRepoSchema);
    return {
      ...mock,
      ...checkTaxLot,
    };
  });

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
    return results === undefined ? results : results[bbl];
  }
}
