import { faker } from "@faker-js/faker";

import { ZoningDistrict } from "../types/ZoningDistrict";

export function createZoningDistrict(): NonNullable<ZoningDistrict> {
  return { id: faker.string.uuid(), label: faker.string.alpha() };
}
