import { zoningDistrictClassCategorySchema } from "./zoningDistrictClassCategorySchema";
import { z } from "zod";

export const zoningDistrictClassSchema = z.object({
  id: z.coerce
    .string()
    .regex(new RegExp("^[A-Z][0-9]+$"))
    .describe("The code associated with the Zoning class."),
  category: z.lazy(() => zoningDistrictClassCategorySchema),
  description: z.coerce.string().describe("Zoning class descriptions."),
  url: z.coerce
    .string()
    .describe("Planning website page that explains the Zoning District"),
  color: z.coerce
    .string()
    .regex(new RegExp("^#([A-Fa-f0-9]{8})$"))
    .describe("Zoning classes from layer groups."),
});
