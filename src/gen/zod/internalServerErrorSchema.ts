import { errorSchema } from "./errorSchema";
import { z } from "zod";

export const internalServerErrorSchema = z.lazy(() => errorSchema);
