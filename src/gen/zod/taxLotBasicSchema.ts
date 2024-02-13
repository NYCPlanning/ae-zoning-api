import { z } from "zod";

export const taxLotBasicSchema = z.object({
  bbl: z
    .string()
    .describe(
      `The ten character code compromised of a one character borough, five character block, and four character lot codes.`,
    )
    .regex(new RegExp("^([0-9]{10})$")),
  boroughId: z
    .string()
    .describe(
      `A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.`,
    )
    .regex(new RegExp("\\b[1-9]\\b")),
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
  landUseId: z
    .string()
    .describe(
      `The two character code to represent the land use. Possible values are 01-11.`,
    )
    .min(2)
    .max(2),
});
