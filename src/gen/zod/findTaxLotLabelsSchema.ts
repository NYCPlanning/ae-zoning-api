import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const findTaxLotLabelsPathParamsSchema = z.object({
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
export const findTaxLotLabelsQueryResponseSchema = z.any();
export const findTaxLotLabels400Schema = z.lazy(() => errorSchema).schema;
export const findTaxLotLabels500Schema = z.lazy(() => errorSchema).schema;
