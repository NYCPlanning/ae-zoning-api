import { createError } from "./createError";
import { BadRequest } from "../types/BadRequest";

export function createBadRequest(): NonNullable<BadRequest> {
  return createError();
}
