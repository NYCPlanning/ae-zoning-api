import { boroughSchema } from "./boroughSchema";
import { landUseSchema } from "./landUseSchema";
import { z } from "zod";

export const taxLotSchema = z.object({
  bbl: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{10})$"))
    .describe(
      "The ten character code compromised of a one character borough, five character block, and four character lot codes.",
    ),
  borough: z.lazy(() => boroughSchema),
  block: z.coerce
    .string()
    .min(1)
    .max(5)
    .describe("The block code, without its padding zeros."),
  lot: z.coerce
    .string()
    .min(1)
    .max(4)
    .describe("The lot code, without its padding zeros."),
  address: z.coerce.string().describe("The street address."),
  landUse: z.lazy(() => landUseSchema),
});
