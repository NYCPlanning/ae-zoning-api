import { z } from "zod";

export const errorSchema = z.object({
  statusCode: z.coerce.number(),
  message: z.coerce.string(),
  error: z.coerce.string().optional(),
});
