import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const findZoningDistrictFillsPathParamsSchema = z.object({
  z: z
    .string()
    .describe(`viewport zoom component`)
    .regex(new RegExp("^([0-9]+)$")),
  x: z
    .string()
    .describe(`viewport x component`)
    .regex(new RegExp("^([0-9]+)$")),
  y: z
    .string()
    .describe(`viewport y component`)
    .regex(new RegExp("^([0-9]+)$")),
});
export const findZoningDistrictFillsQueryResponseSchema = z.any();
export const findZoningDistrictFills400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findZoningDistrictFills500Schema = z.lazy(
  () => errorSchema,
).schema;
