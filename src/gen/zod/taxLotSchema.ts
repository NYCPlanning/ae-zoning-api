import { z } from "zod";

import { boroughSchema } from "./boroughSchema";
import { landUseSchema } from "./landUseSchema";

export const taxLotSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
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
