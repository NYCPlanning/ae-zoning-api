import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createTaxLot } from "./createTaxLot";
import { GetTaxLotByBblPathParams } from "../types/GetTaxLotByBbl";
import { GetTaxLotByBbl400 } from "../types/GetTaxLotByBbl";
import { GetTaxLotByBbl404 } from "../types/GetTaxLotByBbl";
import { GetTaxLotByBbl500 } from "../types/GetTaxLotByBbl";
import { GetTaxLotByBblQueryResponse } from "../types/GetTaxLotByBbl";

export function createGetTaxLotByBblPathParams(): NonNullable<GetTaxLotByBblPathParams> {
  return { bbl: faker.helpers.fromRegExp("/^([0-9]{10})$/") };
}

export function createGetTaxLotByBbl400(): NonNullable<GetTaxLotByBbl400> {
  return createError();
}

export function createGetTaxLotByBbl404(): NonNullable<GetTaxLotByBbl404> {
  return createError();
}

export function createGetTaxLotByBbl500(): NonNullable<GetTaxLotByBbl500> {
  return createError();
}

/**
 * @description A tax lot object
 */

export function createGetTaxLotByBblQueryResponse(): NonNullable<GetTaxLotByBblQueryResponse> {
  return createTaxLot();
}
