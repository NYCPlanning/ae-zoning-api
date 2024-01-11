import { createError } from "./createError";
import { NotFound } from "../types/NotFound";

export function createNotFound(): NonNullable<NotFound> {
  return createError();
}
