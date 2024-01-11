import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createBorough } from "./createBorough";
import { GetBoroughs400 } from "../types/GetBoroughs";
import { GetBoroughs500 } from "../types/GetBoroughs";
import { GetBoroughsQueryResponse } from "../types/GetBoroughs";

export function createGetBoroughs400(): NonNullable<GetBoroughs400> {
  return createError();
}

export function createGetBoroughs500(): NonNullable<GetBoroughs500> {
  return createError();
}

/**
 * @description An object containing all boroughs.
 */

export function createGetBoroughsQueryResponse(): NonNullable<GetBoroughsQueryResponse> {
  return { boroughs: faker.helpers.arrayElements([createBorough()]) as any };
}
