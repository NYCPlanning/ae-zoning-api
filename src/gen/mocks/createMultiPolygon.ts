import { faker } from "@faker-js/faker";

import { createPosition } from "./createPosition";
import { MultiPolygon } from "../types/MultiPolygon";

export function createMultiPolygon(): NonNullable<MultiPolygon> {
  return {
    type: faker.helpers.arrayElement<any>([`MultiPolygon`]),
    coordinates: faker.helpers.arrayElements([
      faker.helpers.arrayElements([
        faker.helpers.arrayElements([createPosition()]) as any,
      ]) as any,
    ]) as any,
  };
}
