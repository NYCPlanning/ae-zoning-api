import { z } from "zod";

export const mvtEntitySchema = z.object({
  mvt: z.unknown(),
});
