import { z } from "zod";

import { zoningDistrictClassCategorySchema } from "./zoningDistrictClassCategorySchema";

export const zoningDistrictClassSchema = z.object({
  id: z
    .string()
    .describe(`The code associated with the Zoning class.`)
    .regex(new RegExp("^[A-Z][0-9]+$")),
  category: z.lazy(() => zoningDistrictClassCategorySchema).schema,
  description: z.string().describe(`Zoning class descriptions.`),
  url: z
    .string()
    .describe(`Planning website page that explains the Zoning District`),
  color: z
    .string()
    .describe(`Zoning classes from layer groups.`)
    .regex(new RegExp("^#([A-Fa-f0-9]{8})$")),
});
