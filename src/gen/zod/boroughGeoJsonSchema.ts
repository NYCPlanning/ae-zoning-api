import { multiPolygonSchema } from "./multiPolygonSchema";
import { boroughSchema } from "./boroughSchema";
import { z } from "zod";

export const boroughGeoJsonSchema = z.object({
  id: z.coerce
    .string()
    .regex(new RegExp("^([0-9])$"))
    .describe(
      "A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.",
    ),
  type: z.enum(["Feature"]),
  geometry: z.lazy(() => multiPolygonSchema),
  properties: z.lazy(() => boroughSchema),
});
