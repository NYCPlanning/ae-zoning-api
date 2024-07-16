import { positionSchema } from "./positionSchema";
import { z } from "zod";

/**
 * @description A geojson implementation of a MultiPoint Simple Feature
 */
export const multiPointSchema = z
  .object({
    type: z.enum(["MultiPoint"]),
    coordinates: z
      .array(z.lazy(() => positionSchema))
      .describe("Array of position coordinate arrays."),
  })
  .describe("A geojson implementation of a MultiPoint Simple Feature");
