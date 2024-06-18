import { pageSchema } from "./pageSchema";
import { taxLotBasicSchema } from "./taxLotBasicSchema";
import { z } from "zod";

export const taxLotBasicPageSchema = z
  .lazy(() => pageSchema)
  .and(z.object({ taxLots: z.array(z.lazy(() => taxLotBasicSchema)) }));
