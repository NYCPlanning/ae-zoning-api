import { z } from "zod";

import { pageSchema } from "./pageSchema";
import { capitalProjectSchema } from "./capitalProjectSchema";

export const capitalProjectPageSchema = z
  .lazy(() => pageSchema)
  .schema.and(
    z.object({
      capitalProjects: z.array(z.lazy(() => capitalProjectSchema).schema),
    }),
  );
