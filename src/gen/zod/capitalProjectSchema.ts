import { capitalProjectCategorySchema } from "./capitalProjectCategorySchema";
import { z } from "zod";

export const capitalProjectSchema = z.object({
  id: z.coerce
    .string()
    .describe(
      "The id for the project, which combines with the managing code to make a unique id",
    ),
  description: z.coerce.string().describe("The capital project title."),
  managingCode: z.coerce
    .string()
    .regex(new RegExp("^([0-9]{3})$"))
    .describe("Three character string of numbers representing managing agency"),
  managingAgencyInitials: z.coerce
    .string()
    .describe("The managing agency name abbreviation or acronym"),
  minDate: z
    .string()
    .date()
    .describe("The starting date of the capital project"),
  maxDate: z.string().date().describe("The ending date of the capital project"),
  category: z.lazy(() => capitalProjectCategorySchema),
});
