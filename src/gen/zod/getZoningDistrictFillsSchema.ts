import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const getZoningDistrictFillsPathParamsSchema = z.object({
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
export const getZoningDistrictFillsQueryResponseSchema = z.any();
export const getZoningDistrictFills400Schema = z.lazy(() => errorSchema).schema;
export const getZoningDistrictFills500Schema = z.lazy(() => errorSchema).schema;
