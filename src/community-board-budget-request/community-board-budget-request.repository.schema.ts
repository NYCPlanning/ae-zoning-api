import { cbbrPolicyAreaEntitySchema } from "src/schema";
import { z } from "zod";

export const findManyCbbrPolicyAreaRepoSchema = z.array(
  cbbrPolicyAreaEntitySchema,
);

export type FindManyCbbrPolicyAreaRepo = z.infer<
  typeof findManyCbbrPolicyAreaRepoSchema
>;
