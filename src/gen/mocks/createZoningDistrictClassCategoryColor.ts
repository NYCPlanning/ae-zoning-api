import { faker } from "@faker-js/faker";

import { createZoningDistrictClassCategory } from "./createZoningDistrictClassCategory";
import { ZoningDistrictClassCategoryColor } from "../types/ZoningDistrictClassCategoryColor";

export function createZoningDistrictClassCategoryColor(): NonNullable<ZoningDistrictClassCategoryColor> {
  return {
    category: createZoningDistrictClassCategory(),
    color: faker.helpers.fromRegExp("/^#([A-Fa-f0-9]{8})$/"),
  };
}
