import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrict } from "./createZoningDistrict";
import { GetZoningDistrictByIdPathParams } from "../types/GetZoningDistrictById";
import { GetZoningDistrictById400 } from "../types/GetZoningDistrictById";
import { GetZoningDistrictById404 } from "../types/GetZoningDistrictById";
import { GetZoningDistrictById500 } from "../types/GetZoningDistrictById";
import { GetZoningDistrictByIdQueryResponse } from "../types/GetZoningDistrictById";

export function createGetZoningDistrictByIdPathParams(): NonNullable<GetZoningDistrictByIdPathParams> {
  return { id: faker.string.uuid() };
}

export function createGetZoningDistrictById400(): NonNullable<GetZoningDistrictById400> {
  return createError();
}

export function createGetZoningDistrictById404(): NonNullable<GetZoningDistrictById404> {
  return createError();
}

export function createGetZoningDistrictById500(): NonNullable<GetZoningDistrictById500> {
  return createError();
}

/**
 * @description A zoning district object
 */

export function createGetZoningDistrictByIdQueryResponse(): NonNullable<GetZoningDistrictByIdQueryResponse> {
  return createZoningDistrict();
}
