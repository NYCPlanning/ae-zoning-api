import { z } from "zod";

export const findByUuidRepoSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
});

export type FindByUuidRepo = z.infer<typeof findByUuidRepoSchema>;
