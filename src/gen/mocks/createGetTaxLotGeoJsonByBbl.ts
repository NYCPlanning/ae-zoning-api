import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createTaxLotGeoJson } from "./createTaxLotGeoJson";
import { GetTaxLotGeoJsonByBblPathParams } from "../types/GetTaxLotGeoJsonByBbl";
import { GetTaxLotGeoJsonByBbl400 } from "../types/GetTaxLotGeoJsonByBbl";
import { GetTaxLotGeoJsonByBbl404 } from "../types/GetTaxLotGeoJsonByBbl";
import { GetTaxLotGeoJsonByBbl500 } from "../types/GetTaxLotGeoJsonByBbl";
import { GetTaxLotGeoJsonByBblQueryResponse } from "../types/GetTaxLotGeoJsonByBbl";

export function createGetTaxLotGeoJsonByBblPathParams(): NonNullable<GetTaxLotGeoJsonByBblPathParams> {
  return { bbl: faker.helpers.fromRegExp("/^([0-9]{10})$/") };
}

export function createGetTaxLotGeoJsonByBbl400(): NonNullable<GetTaxLotGeoJsonByBbl400> {
  return createError();
}

export function createGetTaxLotGeoJsonByBbl404(): NonNullable<GetTaxLotGeoJsonByBbl404> {
  return createError();
}

export function createGetTaxLotGeoJsonByBbl500(): NonNullable<GetTaxLotGeoJsonByBbl500> {
  return createError();
}

/**
 * @description A tax lot geojson object
 */

export function createGetTaxLotGeoJsonByBblQueryResponse(): NonNullable<GetTaxLotGeoJsonByBblQueryResponse> {
  return createTaxLotGeoJson();
}
