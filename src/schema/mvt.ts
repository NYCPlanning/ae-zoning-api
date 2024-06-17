import { z } from "zod";

export const mvtEntitySchema = z.string();

export type MvtEntity = z.infer<typeof mvtEntitySchema>;
