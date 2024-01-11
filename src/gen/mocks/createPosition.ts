import { faker } from "@faker-js/faker";

import { Position } from "../types/Position";

export function createPosition(): NonNullable<Position> {
  return faker.helpers.arrayElements([faker.number.float({})]) as any;
}
