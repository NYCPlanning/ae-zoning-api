import { z } from "zod";
import { boroughSchema } from "./boroughSchema";
import { errorSchema } from "./errorSchema";

/**
 * @description An object containing all boroughs.
 */
export const findBoroughs200Schema = z.object({
  boroughs: z.array(z.lazy(() => boroughSchema)),
});
/**
 * @description Invalid client request
 */
export const findBoroughs400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findBoroughs500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing all boroughs.
 */
export const findBoroughsQueryResponseSchema = z.object({
  boroughs: z.array(z.lazy(() => boroughSchema)),
});
