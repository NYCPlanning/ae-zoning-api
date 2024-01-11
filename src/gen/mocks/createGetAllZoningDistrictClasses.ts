import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrictClass } from "./createZoningDistrictClass";
import { GetAllZoningDistrictClasses400 } from "../types/GetAllZoningDistrictClasses";
import { GetAllZoningDistrictClasses500 } from "../types/GetAllZoningDistrictClasses";
import { GetAllZoningDistrictClassesQueryResponse } from "../types/GetAllZoningDistrictClasses";

export function createGetAllZoningDistrictClasses400(): NonNullable<GetAllZoningDistrictClasses400> {
  return createError();
}

export function createGetAllZoningDistrictClasses500(): NonNullable<GetAllZoningDistrictClasses500> {
  return createError();
}

/**
 * @description An object containing all zoning district class schemas.
 */

export function createGetAllZoningDistrictClassesQueryResponse(): NonNullable<GetAllZoningDistrictClassesQueryResponse> {
  return {
    zoningDistrictClasses: faker.helpers.arrayElements([
      createZoningDistrictClass(),
    ]) as any,
  };
}
