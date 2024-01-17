import { z } from "zod";
import { boroughEntitySchema, landUseEntitySchema } from "src/schema";

export const findByBblRepoSchema = z.object({
  bbl: z.string().regex(RegExp("^([0-9]{10})$")),
  block: z.string().regex(RegExp("^([0-9]{1,5})$")),
  lot: z.string().regex(RegExp("^([0-9]{1,4})$")),
  address: z.string().nullable(),
  borough: boroughEntitySchema,
  landUse: landUseEntitySchema.nullable(),
});

export type FindByBblRepo = z.infer<typeof findByBblRepoSchema>;

export const findByBblSpatialRepoSchema = findByBblRepoSchema.extend({
  geometry: z
    .string()
    /**
     * Geometries are formatted as strings that are shaped like geometry objects.
     * The regular expression checks several factors to ensure the string is parsable into a valid geometry object
     * - There is a type of "MultiPolygon"
     * - There are coordinates which follow the geojson specification
     *   - The numbers are general enough to support multiple coordinate systems
     *   - The first character may be a minus indicator
     *   - The left most digit is 1 through 9
     *   - Additional digits before decimal place are optional but they may be 0 through 9.
     *   - A decimal only exists if there are numbers after it
     *   - There may be up to 14 digits after the decimal place and they may be 0 through 9.
     * - The digits are grouped into valid arrays
     *   - Numbers are paired into a tuple of length two to create positions
     *   - Positions are grouped into arrays to create Polygons
     *     - The length is at least 4. The first three points create a Polygon. The fourth point closes the polygon by returning the starting point
     *     - The first Position does not have a leading comma
     *     - The subsequent Positions have leading commas
     *   - There may be an array of multiple Polygons to create a MultiPolygon
     *     - The first Polygon array does not have a leading comma
     *     - Any subsequent Polygon arrays start with a leading comma
     *   - The MultiPolygon is wrapped in another array, by the geojson specification
     *
     * It is possible for the "coordinates" and "type" keys to be swapped in an actual geojson value. It may also be possible to write the type in lowercase.
     * A geojson value with these variations would still be valid but it would fail this regex because the regex looks at the key order literally.
     * For our purposes, we are using this regex to generate test data. The regex succeeds in this use case.
     * However, if we want to also use it for validation of real data, then the regex would likely need to be refined.
     * */
    .regex(
      /^{"type":"MultiPolygon","coordinates":\[\[(\[\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\](,\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\]){3,}\])(,\[\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\](,\[-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?,-?[1-9]([0-9]{0,})(\.[0-9]{1,14})?\]){3,}\]){0,}\]\]}$/,
    ),
});

export type FindByBblSpatialRepo = z.infer<typeof findByBblSpatialRepoSchema>;
