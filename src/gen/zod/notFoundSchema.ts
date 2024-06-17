import { errorSchema } from "./errorSchema";
import { z } from "zod";

export const notFoundSchema = z.lazy(() => errorSchema);
