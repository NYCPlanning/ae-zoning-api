import { z } from "zod";

/**
 * @description The fundamental spatial construct
 */
export const positionSchema = z
  .array(z.coerce.number())
  .min(2)
  .max(3)
  .describe("The fundamental spatial construct");
