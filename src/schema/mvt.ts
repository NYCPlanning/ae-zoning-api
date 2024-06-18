import { z } from "zod";

export const mvtEntitySchema = z.instanceof(Buffer);

export type MvtEntity = z.infer<typeof mvtEntitySchema>;
