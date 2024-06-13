import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { capitalProjectBudgetedSchema } from "./capitalProjectBudgetedSchema";

export const findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema =
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
export const findCapitalProjectByManagingCodeCapitalProjectId400Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCapitalProjectByManagingCodeCapitalProjectId404Schema = z.lazy(
  () => errorSchema,
).schema;
export const findCapitalProjectByManagingCodeCapitalProjectId500Schema = z.lazy(
  () => errorSchema,
).schema;

/**
 * @description An object of capital project details
 */
export const findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema =
  z.lazy(() => capitalProjectBudgetedSchema).schema;
