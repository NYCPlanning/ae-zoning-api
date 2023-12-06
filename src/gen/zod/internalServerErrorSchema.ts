import { z } from "zod";

import { errorSchema } from "./errorSchema";

export const internalServerErrorSchema = z.lazy(() => errorSchema).schema;
