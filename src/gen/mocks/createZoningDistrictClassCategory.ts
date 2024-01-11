import { faker } from "@faker-js/faker";

import { ZoningDistrictClassCategory } from "../types/ZoningDistrictClassCategory";

export function createZoningDistrictClassCategory(): NonNullable<ZoningDistrictClassCategory> {
  return faker.helpers.arrayElement<any>([
    `Residential`,
    `Commercial`,
    `Manufacturing`,
  ]);
}
