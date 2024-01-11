import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrictClass } from "./createZoningDistrictClass";
import { GetZoningDistrictClassesByIdPathParams } from "../types/GetZoningDistrictClassesById";
import { GetZoningDistrictClassesById400 } from "../types/GetZoningDistrictClassesById";
import { GetZoningDistrictClassesById404 } from "../types/GetZoningDistrictClassesById";
import { GetZoningDistrictClassesById500 } from "../types/GetZoningDistrictClassesById";
import { GetZoningDistrictClassesByIdQueryResponse } from "../types/GetZoningDistrictClassesById";

export function createGetZoningDistrictClassesByIdPathParams(): NonNullable<GetZoningDistrictClassesByIdPathParams> {
  return {
    id: faker.helpers.fromRegExp("/^((C[1-8])|(M[1-3])|(R([1-9]|10)))$/"),
  };
}

export function createGetZoningDistrictClassesById400(): NonNullable<GetZoningDistrictClassesById400> {
  return createError();
}

export function createGetZoningDistrictClassesById404(): NonNullable<GetZoningDistrictClassesById404> {
  return createError();
}

export function createGetZoningDistrictClassesById500(): NonNullable<GetZoningDistrictClassesById500> {
  return createError();
}

/**
 * @description A class schema for a zoning district
 */

export function createGetZoningDistrictClassesByIdQueryResponse(): NonNullable<GetZoningDistrictClassesByIdQueryResponse> {
  return createZoningDistrictClass();
}
