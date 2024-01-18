import { boroughEntitySchema } from "src/schema";
import { z } from "zod";

export const findAllRepoSchema = z.array(boroughEntitySchema);

export type FindAllRepo = z.infer<typeof findAllRepoSchema>;
