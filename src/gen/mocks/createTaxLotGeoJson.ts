import { faker } from "@faker-js/faker";

import { createMultiPolygon } from "./createMultiPolygon";
import { createTaxLot } from "./createTaxLot";
import { TaxLotGeoJson } from "../types/TaxLotGeoJson";

export function createTaxLotGeoJson(): NonNullable<TaxLotGeoJson> {
  return {
    id: faker.string.alpha(),
    type: faker.helpers.arrayElement<any>([`Feature`]),
    geometry: createMultiPolygon(),
    properties: createTaxLot(),
  };
}
