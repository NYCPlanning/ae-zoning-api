import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const getZoningDistrictLabelsPathParamsSchema = z.object({
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
export const getZoningDistrictLabelsQueryResponseSchema = z.any();
export const getZoningDistrictLabels400Schema = z.lazy(
  () => errorSchema,
).schema;
export const getZoningDistrictLabels500Schema = z.lazy(
  () => errorSchema,
).schema;
