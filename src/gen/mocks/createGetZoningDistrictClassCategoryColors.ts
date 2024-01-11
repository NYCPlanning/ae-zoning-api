import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrictClassCategoryColor } from "./createZoningDistrictClassCategoryColor";
import { GetZoningDistrictClassCategoryColors400 } from "../types/GetZoningDistrictClassCategoryColors";
import { GetZoningDistrictClassCategoryColors500 } from "../types/GetZoningDistrictClassCategoryColors";
import { GetZoningDistrictClassCategoryColorsQueryResponse } from "../types/GetZoningDistrictClassCategoryColors";

export function createGetZoningDistrictClassCategoryColors400(): NonNullable<GetZoningDistrictClassCategoryColors400> {
  return createError();
}

export function createGetZoningDistrictClassCategoryColors500(): NonNullable<GetZoningDistrictClassCategoryColors500> {
  return createError();
}

/**
 * @description An object containing all zoning district category colors.
 */

export function createGetZoningDistrictClassCategoryColorsQueryResponse(): NonNullable<GetZoningDistrictClassCategoryColorsQueryResponse> {
  return {
    zoningDistrictClassCategoryColors: faker.helpers.arrayElements([
      createZoningDistrictClassCategoryColor(),
    ]) as any,
  };
}
