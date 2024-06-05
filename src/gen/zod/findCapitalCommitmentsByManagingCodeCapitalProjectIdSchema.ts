import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { capitalCommitmentSchema } from "./capitalCommitmentSchema";

export const findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema =
  z.object({
    managingCode: z
      .string()
      .describe(
        `Three character string of numbers representing managing agency`,
      )
      .regex(new RegExp("^([0-9]{3})$")),
    capitalProjectId: z
      .string()
      .describe(
        `The id for the project, which combines with the managing code to make a unique id`,
      ),
  });
export const findCapitalCommitmentsByManagingCodeCapitalProjectId400Schema =
  z.lazy(() => errorSchema).schema;
export const findCapitalCommitmentsByManagingCodeCapitalProjectId404Schema =
  z.lazy(() => errorSchema).schema;
export const findCapitalCommitmentsByManagingCodeCapitalProjectId500Schema =
  z.lazy(() => errorSchema).schema;

/**
 * @description an object of capital commitments for the capital project
 */
export const findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema =
  z.object({
    capitalCommitments: z.array(z.lazy(() => capitalCommitmentSchema).schema),
  });
