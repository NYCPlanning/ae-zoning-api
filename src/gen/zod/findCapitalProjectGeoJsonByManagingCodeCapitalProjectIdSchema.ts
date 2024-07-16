import { z } from "zod";
import { capitalProjectBudgetedGeoJsonSchema } from "./capitalProjectBudgetedGeoJsonSchema";
import { errorSchema } from "./errorSchema";

export const findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParamsSchema =
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
 * @description A capital project geojson object
 */
export const findCapitalProjectGeoJsonByManagingCodeCapitalProjectId200Schema =
  z.lazy(() => capitalProjectBudgetedGeoJsonSchema);
/**
 * @description Invalid client request
 */
export const findCapitalProjectGeoJsonByManagingCodeCapitalProjectId400Schema =
  z.lazy(() => errorSchema);
/**
 * @description Requested resource does not exist or is not available
 */
export const findCapitalProjectGeoJsonByManagingCodeCapitalProjectId404Schema =
  z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findCapitalProjectGeoJsonByManagingCodeCapitalProjectId500Schema =
  z.lazy(() => errorSchema);
/**
 * @description A capital project geojson object
 */
export const findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema =
  z.lazy(() => capitalProjectBudgetedGeoJsonSchema);
