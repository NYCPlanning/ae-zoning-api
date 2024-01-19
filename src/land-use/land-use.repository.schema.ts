import { landUseEntitySchema } from "src/schema";
import { z } from "zod";

export const findAllRepoSchema = z.array(landUseEntitySchema);

export type FindAllRepo = z.infer<typeof findAllRepoSchema>;
