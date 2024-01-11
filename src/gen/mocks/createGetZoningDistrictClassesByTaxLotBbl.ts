import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createZoningDistrictClass } from "./createZoningDistrictClass";
import { GetZoningDistrictClassesByTaxLotBblPathParams } from "../types/GetZoningDistrictClassesByTaxLotBbl";
import { GetZoningDistrictClassesByTaxLotBbl400 } from "../types/GetZoningDistrictClassesByTaxLotBbl";
import { GetZoningDistrictClassesByTaxLotBbl404 } from "../types/GetZoningDistrictClassesByTaxLotBbl";
import { GetZoningDistrictClassesByTaxLotBbl500 } from "../types/GetZoningDistrictClassesByTaxLotBbl";
import { GetZoningDistrictClassesByTaxLotBblQueryResponse } from "../types/GetZoningDistrictClassesByTaxLotBbl";

export function createGetZoningDistrictClassesByTaxLotBblPathParams(): NonNullable<GetZoningDistrictClassesByTaxLotBblPathParams> {
  return { bbl: faker.helpers.fromRegExp("/^([0-9]{10})$/") };
}

export function createGetZoningDistrictClassesByTaxLotBbl400(): NonNullable<GetZoningDistrictClassesByTaxLotBbl400> {
  return createError();
}

export function createGetZoningDistrictClassesByTaxLotBbl404(): NonNullable<GetZoningDistrictClassesByTaxLotBbl404> {
  return createError();
}

export function createGetZoningDistrictClassesByTaxLotBbl500(): NonNullable<GetZoningDistrictClassesByTaxLotBbl500> {
  return createError();
}

/**
 * @description An object containing zoning district class schemas.
 */

export function createGetZoningDistrictClassesByTaxLotBblQueryResponse(): NonNullable<GetZoningDistrictClassesByTaxLotBblQueryResponse> {
  return {
    zoningDistrictClasses: faker.helpers.arrayElements([
      createZoningDistrictClass(),
    ]) as any,
  };
}
