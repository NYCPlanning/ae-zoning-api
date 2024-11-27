import { pageSchema } from "./pageSchema";
import { taxLotBlockIdSchema } from "./taxLotBlockIdSchema";
import { z } from "zod";

export const taxLotBlockIdPageSchema = z
  .lazy(() => pageSchema)
  .and(z.object({ blockIds: z.array(z.lazy(() => taxLotBlockIdSchema)) }));
