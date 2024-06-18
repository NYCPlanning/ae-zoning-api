import { z } from "zod";
import { capitalCommitmentSchema } from "./capitalCommitmentSchema";
import { errorSchema } from "./errorSchema";

export const findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema =
  z.object({
    managingCode: z.coerce
      .string()
      .regex(new RegExp("^([0-9]{3})$"))
      .describe(
        "Three character string of numbers representing managing agency",
      ),
    capitalProjectId: z.coerce
      .string()
      .describe(
        "The id for the project, which combines with the managing code to make a unique id",
      ),
  });
/**
 * @description an object of capital commitments for the capital project
 */
export const findCapitalCommitmentsByManagingCodeCapitalProjectId200Schema =
  z.object({
    capitalCommitments: z.array(z.lazy(() => capitalCommitmentSchema)),
  });
/**
 * @description Invalid client request
 */
export const findCapitalCommitmentsByManagingCodeCapitalProjectId400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCapitalCommitmentsByManagingCodeCapitalProjectId404Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCapitalCommitmentsByManagingCodeCapitalProjectId500Schema =
  z.lazy(() => errorSchema);
/**
 * @description an object of capital commitments for the capital project
 */
export const findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema =
  z.object({
    capitalCommitments: z.array(z.lazy(() => capitalCommitmentSchema)),
  });
