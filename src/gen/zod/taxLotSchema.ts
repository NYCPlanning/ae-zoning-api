import { boroughSchema } from "./boroughSchema";
import { landUseSchema } from "./landUseSchema";
import { z } from "zod";

export const taxLotSchema = z.object({
  borough: z.lazy(() => boroughSchema),
  blockId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{5})$"))
    .describe("The block code for the bbl")
    .optional(),
  lotId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{4})$"))
    .describe("The lot code for the bbl")
    .optional(),
  address: z.coerce.string().describe("The street address."),
  landUse: z.lazy(() => landUseSchema),
});
