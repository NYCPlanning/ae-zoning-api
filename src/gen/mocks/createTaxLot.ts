import { faker } from "@faker-js/faker";

import { createBorough } from "./createBorough";
import { createLandUse } from "./createLandUse";
import { TaxLot } from "../types/TaxLot";

export function createTaxLot(): NonNullable<TaxLot> {
  return {
    bbl: faker.string.alpha(),
    borough: createBorough(),
    block: faker.string.alpha(),
    lot: faker.string.alpha(),
    address: faker.string.alpha(),
    landUse: createLandUse(),
  };
}
