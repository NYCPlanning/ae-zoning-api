import { zoningDistrictEntitySchema } from "src/schema";
import { z } from "zod";

export const findByUuidRepoSchema = zoningDistrictEntitySchema;

export type FindByUuidRepo = z.infer<typeof findByUuidRepoSchema>;
