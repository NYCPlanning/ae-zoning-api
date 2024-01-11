import { faker } from "@faker-js/faker";

import { LandUse } from "../types/LandUse";

export function createLandUse(): NonNullable<LandUse> {
  return {
    id: faker.string.alpha(),
    description: faker.string.alpha(),
    color: faker.helpers.fromRegExp("/^#([A-Fa-f0-9]{8})$/"),
  };
}
