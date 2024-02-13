import { z } from "zod";

import { pageSchema } from "./pageSchema";
import { taxLotBasicSchema } from "./taxLotBasicSchema";

export const taxLotBasicPageSchema = z
  .lazy(() => pageSchema)
  .schema.and(
    z.object({ taxLots: z.array(z.lazy(() => taxLotBasicSchema).schema) }),
  );
