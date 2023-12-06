import { z } from "zod";

import { zoningDistrictClassCategorySchema } from "./zoningDistrictClassCategorySchema";

export const zoningDistrictClassSchema = z.object({
  id: z
    .string()
    .describe(`The code associated with the Zoning class.`)
    .regex(new RegExp("^((C[1-8])|(M[1-3])|(R([1-9]|10)))$"))
    .optional(),
  category: z.lazy(() => zoningDistrictClassCategorySchema).schema.optional(),
  description: z.string().describe(`Zoning class descriptions.`).optional(),
  url: z
    .string()
    .describe(`Planning website page that explains the Zoning District`)
    .optional(),
  color: z
    .string()
    .describe(`Zoning classes from layer groups.`)
    .regex(new RegExp("^#([A-Fa-f0-9]{8})$"))
    .optional(),
});
