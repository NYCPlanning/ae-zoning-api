import { z } from "zod";
import { taxLotBasicPageSchema } from "./taxLotBasicPageSchema";
import { errorSchema } from "./errorSchema";

export const findTaxLotsQueryParamsSchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .describe(
        "The maximum number of results to be returned in each response. The default value is 20. It must be between 1 and 100, inclusive.",
      )
      .optional(),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .describe(
        "The position in the full list to begin returning results. Default offset is 0. If the offset is beyond the end of the list, no results will be returned.",
      )
      .optional(),
    geometry: z
      .enum(["Point", "LineString", "Polygon"])
      .describe(
        "The type of geometry used for a spatial filter. It must be provided when applying a spatial filter; each geometry has its own coordinate requirements. Point geometries have length of 1. LineString geometries have length of 2 to 5, inclusive. Polygons have length 4 to 5, inclusive; the last coordinate must match the first coordinate to close the polygon.",
      )
      .optional(),
    lons: z
      .array(z.coerce.number())
      .min(1)
      .max(5)
      .describe(
        "The longitude portion of coordinates. It must be provided when applying a spatial filter and have the same length as the latitudes. (If using a tool like axios, serializing the array with brackets is also supported. ex; lons[]=-74.010776&lons[]=-74.010776)",
      )
      .optional(),
    lats: z
      .array(z.coerce.number())
      .min(1)
      .max(5)
      .describe(
        "The latitude portion of coordinates. It must be provided when applying a spatial filter and have the same length as the longitudes. (If using a tool like axios, serializing the array with brackets is also supported. ex; lats[]=40.708649&lats[]=40.707800)",
      )
      .optional(),
    buffer: z.coerce
      .number()
      .describe(
        "A buffer around the spatial feature. Units are feet. It is optional when applying a spatial filter.",
      )
      .optional(),
  })
  .optional();
/**
 * @description An object containing a list of tax lots and pagination metadata. An optional spatial filter will return all tax lots that intersect the spatial feature and its optional buffer. When applying a spatial filter, tax lots are ordered by their closeness to the spatial feature.
 */
export const findTaxLots200Schema = z.lazy(() => taxLotBasicPageSchema);
/**
 * @description Invalid client request
 */
export const findTaxLots400Schema = z.lazy(() => errorSchema);
/**
 * @description Server side error
 */
export const findTaxLots500Schema = z.lazy(() => errorSchema);
/**
 * @description An object containing a list of tax lots and pagination metadata. An optional spatial filter will return all tax lots that intersect the spatial feature and its optional buffer. When applying a spatial filter, tax lots are ordered by their closeness to the spatial feature.
 */
export const findTaxLotsQueryResponseSchema = z.lazy(
  () => taxLotBasicPageSchema,
);
