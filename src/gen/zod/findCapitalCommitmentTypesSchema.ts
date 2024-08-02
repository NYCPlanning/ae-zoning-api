import { z } from "zod";
import { capitalCommitmentTypeSchema } from "./capitalCommitmentTypeSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all capital commitment types.
 */
export const findCapitalCommitmentTypes200Schema = z.object({
  capitalCommitmentTypes: z.array(z.lazy(() => capitalCommitmentTypeSchema)),
});
/**
 * @description Invalid client request
 */
export const findCapitalCommitmentTypes400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCapitalCommitmentTypes500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing all capital commitment types.
 */
export const findCapitalCommitmentTypesQueryResponseSchema = z.object({
  capitalCommitmentTypes: z.array(z.lazy(() => capitalCommitmentTypeSchema)),
});
