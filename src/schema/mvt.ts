import { z } from "zod";

export const mvtEntitySchema = z.unknown();

export type MvtEntity = z.infer<typeof mvtEntitySchema>;
