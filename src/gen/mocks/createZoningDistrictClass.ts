import { faker } from "@faker-js/faker";

import { createZoningDistrictClassCategory } from "./createZoningDistrictClassCategory";
import { ZoningDistrictClass } from "../types/ZoningDistrictClass";

export function createZoningDistrictClass(): NonNullable<ZoningDistrictClass> {
  return {
    id: faker.helpers.fromRegExp("/^((C[1-8])|(M[1-3])|(R([1-9]|10)))$/"),
    category: createZoningDistrictClassCategory(),
    description: faker.string.alpha(),
    url: faker.string.alpha(),
    color: faker.helpers.fromRegExp("/^#([A-Fa-f0-9]{8})$/"),
  };
}
