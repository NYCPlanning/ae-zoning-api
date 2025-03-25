import { pageSchema } from "./pageSchema";
import { capitalProjectSchema } from "./capitalProjectSchema";
import { z } from "zod";

export const capitalProjectPageSchema = z
  .lazy(() => pageSchema)
  .and(
    z.object({
      capitalProjects: z.array(z.lazy(() => capitalProjectSchema)),
      totalProjects: z.coerce
        .number()
        .int()
        .min(0)
        .describe("The total number of results matching the query parameters."),
    }),
  );
