import { cityCouncilDistrictSchema } from "./cityCouncilDistrictSchema";
import { multiPolygonSchema } from "./multiPolygonSchema";
import { z } from "zod";

export const cityCouncilDistrictGeoJsonSchema = z.object({
  id: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{1,2})$"))
    .describe("One or two character code to represent city council districts."),
  type: z.enum(["Feature"]),
  properties: z.lazy(() => cityCouncilDistrictSchema),
  geometry: z.lazy(() => multiPolygonSchema),
});
