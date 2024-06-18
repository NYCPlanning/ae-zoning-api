import { z } from "zod";

export const taxLotBasicSchema = z.object({
  bbl: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{10})$"))
    .describe(
      "The ten character code compromised of a one character borough, five character block, and four character lot codes.",
    ),
  boroughId: z.coerce
    .string()
    .regex(new RegExp("^([0-9])$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
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
  landUseId: z.coerce
    .string()
    .min(2)
    .max(2)
    .describe(
      "The two character code to represent the land use. Possible values are 01-11.",
    ),
});
