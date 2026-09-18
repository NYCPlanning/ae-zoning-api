import { mvtEntitySchema } from "src/schema/mvt";
import { z } from "zod";

export const findTilesRepoSchema = mvtEntitySchema;

export type FindTilesRepo = z.infer<typeof findTilesRepoSchema>;
