import { pageSchema } from "./pageSchema";
import { taxLotLotIdSchema } from "./taxLotLotIdSchema";
import { z } from "zod";

export const taxLotLotIdPageSchema = z
  .lazy(() => pageSchema)
  .and(z.object({ lotIds: z.array(z.lazy(() => taxLotLotIdSchema)) }));
