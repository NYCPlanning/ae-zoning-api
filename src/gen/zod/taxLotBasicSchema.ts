import { z } from "zod";

export const taxLotBasicSchema = z.object({
  boroughId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{1})$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
  blockId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{5})$"))
    .describe("The block code for the bbl"),
  lotId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{4})$"))
    .describe("The lot code for the bbl"),
  address: z.coerce.string().describe("The street address.").nullable(),
  landUseId: z.coerce
    .string()
    .min(2)
    .max(2)
    .describe(
      "The two character code to represent the land use. Possible values are 01-11.",
    )
    .nullable(),
});
