import { communityDistrictSchema } from "./communityDistrictSchema";
import { multiPolygonSchema } from "./multiPolygonSchema";
import { z } from "zod";

export const communityDistrictGeoJsonSchema = z.object({
  id: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{3})$"))
    .describe(
      "Three character code to represent a borough and community district.",
    ),
  type: z.enum(["Feature"]),
  properties: z.lazy(() => communityDistrictSchema),
  geometry: z.lazy(() => multiPolygonSchema),
});
