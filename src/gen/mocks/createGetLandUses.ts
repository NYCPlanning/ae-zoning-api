import { faker } from "@faker-js/faker";

import { createError } from "./createError";
import { createLandUse } from "./createLandUse";
import { GetLandUses400 } from "../types/GetLandUses";
import { GetLandUses500 } from "../types/GetLandUses";
import { GetLandUsesQueryResponse } from "../types/GetLandUses";

export function createGetLandUses400(): NonNullable<GetLandUses400> {
  return createError();
}

export function createGetLandUses500(): NonNullable<GetLandUses500> {
  return createError();
}

/**
 * @description An object containing all land uses.
 */

export function createGetLandUsesQueryResponse(): NonNullable<GetLandUsesQueryResponse> {
  return { landUses: faker.helpers.arrayElements([createLandUse()]) as any };
}
