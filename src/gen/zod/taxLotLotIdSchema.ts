import { z } from "zod";

export const taxLotLotIdSchema = z.object({
  lotId: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{4})$"))
    .describe("The lot code for the bbl"),
});
