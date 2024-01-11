import { faker } from "@faker-js/faker";

import { Borough } from "../types/Borough";

export function createBorough(): NonNullable<Borough> {
  return {
    id: faker.helpers.fromRegExp("/\\b[1-9]\\b/"),
    title: faker.string.alpha(),
    abbr: faker.string.alpha(),
  };
}
