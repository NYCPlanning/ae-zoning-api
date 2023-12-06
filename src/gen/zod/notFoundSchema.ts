import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const notFoundSchema = z.lazy(() => errorSchema).schema;
