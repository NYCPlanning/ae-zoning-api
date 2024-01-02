import { z } from "zod";

import { bblSchema } from "./bblSchema";
import { boroughSchema } from "./boroughSchema";
import { landUseSchema } from "./landUseSchema";

export const taxLotSchema = z.object({
  bbl: z.lazy(() => bblSchema).schema,
  borough: z.lazy(() => boroughSchema).schema,
  block: z
    .string()
    .describe(`The block code, without its padding zeros.`)
    .min(1)
    .max(5),
  lot: z
    .string()
    .describe(`The lot code, without its padding zeros.`)
    .min(1)
    .max(4),
  address: z.string().describe(`The street address.`),
  landUse: z.lazy(() => landUseSchema).schema,
});
