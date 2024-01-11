import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrictClass } from "./createZoningDistrictClass";
import { GetZoningDistrictClassesByUuidPathParams } from "../types/GetZoningDistrictClassesByUuid";
import { GetZoningDistrictClassesByUuid400 } from "../types/GetZoningDistrictClassesByUuid";
import { GetZoningDistrictClassesByUuid404 } from "../types/GetZoningDistrictClassesByUuid";
import { GetZoningDistrictClassesByUuid500 } from "../types/GetZoningDistrictClassesByUuid";
import { GetZoningDistrictClassesByUuidQueryResponse } from "../types/GetZoningDistrictClassesByUuid";

export function createGetZoningDistrictClassesByUuidPathParams(): NonNullable<GetZoningDistrictClassesByUuidPathParams> {
  return { uuid: faker.string.uuid() };
}

export function createGetZoningDistrictClassesByUuid400(): NonNullable<GetZoningDistrictClassesByUuid400> {
  return createError();
}

export function createGetZoningDistrictClassesByUuid404(): NonNullable<GetZoningDistrictClassesByUuid404> {
  return createError();
}

export function createGetZoningDistrictClassesByUuid500(): NonNullable<GetZoningDistrictClassesByUuid500> {
  return createError();
}

/**
 * @description An object of class schemas for the zoning district.
 */

export function createGetZoningDistrictClassesByUuidQueryResponse(): NonNullable<GetZoningDistrictClassesByUuidQueryResponse> {
  return {
    zoningDistrictClasses: faker.helpers.arrayElements([
      createZoningDistrictClass(),
    ]) as any,
  };
}
