import { z } from "zod";

export const errorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
});
