import { z } from "zod";

export const taxLotBlockIdSchema = z.object({
  blockId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{5})$"))
    .describe("The block code for the bbl"),
});
