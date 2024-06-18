import { errorSchema } from "./errorSchema";
import { z } from "zod";

export const badRequestSchema = z.lazy(() => errorSchema);
