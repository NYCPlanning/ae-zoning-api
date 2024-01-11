import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrict } from "./createZoningDistrict";
import { GetZoningDistrictsByTaxLotBblPathParams } from "../types/GetZoningDistrictsByTaxLotBbl";
import { GetZoningDistrictsByTaxLotBbl400 } from "../types/GetZoningDistrictsByTaxLotBbl";
import { GetZoningDistrictsByTaxLotBbl404 } from "../types/GetZoningDistrictsByTaxLotBbl";
import { GetZoningDistrictsByTaxLotBbl500 } from "../types/GetZoningDistrictsByTaxLotBbl";
import { GetZoningDistrictsByTaxLotBblQueryResponse } from "../types/GetZoningDistrictsByTaxLotBbl";

export function createGetZoningDistrictsByTaxLotBblPathParams(): NonNullable<GetZoningDistrictsByTaxLotBblPathParams> {
  return { bbl: faker.helpers.fromRegExp("/^([0-9]{10})$/") };
}

export function createGetZoningDistrictsByTaxLotBbl400(): NonNullable<GetZoningDistrictsByTaxLotBbl400> {
  return createError();
}

export function createGetZoningDistrictsByTaxLotBbl404(): NonNullable<GetZoningDistrictsByTaxLotBbl404> {
  return createError();
}

export function createGetZoningDistrictsByTaxLotBbl500(): NonNullable<GetZoningDistrictsByTaxLotBbl500> {
  return createError();
}

/**
 * @description An object containing zoning districts.
 */

export function createGetZoningDistrictsByTaxLotBblQueryResponse(): NonNullable<GetZoningDistrictsByTaxLotBblQueryResponse> {
  return {
    zoningDistricts: faker.helpers.arrayElements([
      createZoningDistrict(),
    ]) as any,
  };
}
