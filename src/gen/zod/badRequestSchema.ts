import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const badRequestSchema = z.lazy(() => errorSchema).schema;
