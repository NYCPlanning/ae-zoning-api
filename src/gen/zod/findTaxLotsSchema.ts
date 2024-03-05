import { z } from "zod";

import { errorSchema } from "./errorSchema";
import { taxLotBasicPageSchema } from "./taxLotBasicPageSchema";

export const findTaxLotsQueryParamsSchema = z.object({
  limit: z
    .number()
    .describe(
      `The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.`,
    )
    .min(1)
    .max(100)
    .optional(),
  offset: z
    .number()
    .describe(
      `The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.`,
    )
    .min(0)
    .optional(),
  geometry: z
    .enum([`Point`, `LineString`, `Polygon`])
    .describe(
      `The type of geometry used for a spatial filter. It must be provided when applying a spatial filter; each geometry has its own coordinate requirements. Point geometries have length of 1. LineString geometries have length of 2 to 5, inclusive. Polygons have length 4 to 5, inclusive; the last coordinate must match the first coordinate to close the polygon.`,
    )
    .optional(),
  lons: z
    .array(z.number())
    .describe(
      `The longitude portion of coordinates. It must be provided when applying a spatial filter and have the same length as the latitudes.`,
    )
    .min(1)
    .max(5)
    .optional(),
  lats: z
    .array(z.number())
    .describe(
      `The latitude portion of coordinates. It must be provided when applying a spatial filter and have the same length as the longitudes.`,
    )
    .min(1)
    .max(5)
    .optional(),
  buffer: z
    .number()
    .describe(
      `A buffer around the spatial feature. Units are feet. It is optional when applying a spatial filter.`,
    )
    .optional(),
});
export const findTaxLots400Schema = z.lazy(() => errorSchema).schema;
export const findTaxLots500Schema = z.lazy(() => errorSchema).schema;

/**
 * @description An object containing a list of tax lots and pagination metadata. An optional spatial filter will return all tax lots that intersect the spatial feature and its optional buffer. When applying a spatial filter, tax lots are ordered by their closeness to the spatial feature.
 */
export const findTaxLotsQueryResponseSchema = z.lazy(
  () => taxLotBasicPageSchema,
).schema;
