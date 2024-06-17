import { z } from "zod";
import { capitalProjectBudgetedSchema } from "./capitalProjectBudgetedSchema";
import { errorSchema } from "./errorSchema";

export const findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema =
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
 * @description An object of capital project details
 */
export const findCapitalProjectByManagingCodeCapitalProjectId200Schema = z.lazy(
  () => capitalProjectBudgetedSchema,
);
/**
 * @description Invalid client request
 */
export const findCapitalProjectByManagingCodeCapitalProjectId400Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCapitalProjectByManagingCodeCapitalProjectId404Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description Server side error
 */
export const findCapitalProjectByManagingCodeCapitalProjectId500Schema = z.lazy(
  () => errorSchema,
);
/**
 * @description An object of capital project details
 */
export const findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema =
  z.lazy(() => capitalProjectBudgetedSchema);
