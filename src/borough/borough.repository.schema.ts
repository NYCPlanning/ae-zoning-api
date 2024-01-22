import { boroughEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyRepoSchema = z.array(boroughEntitySchema);

export type FindManyRepo = z.infer<typeof findManyRepoSchema>;
