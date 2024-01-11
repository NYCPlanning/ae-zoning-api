import { createError } from "./createError";
import { InternalServerError } from "../types/InternalServerError";

export function createInternalServerError(): NonNullable<InternalServerError> {
  return createError();
}
