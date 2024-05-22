import { z } from "zod";

import { capitalProjectCategorySchema } from "./capitalProjectCategorySchema";

export const capitalProjectSchema = z.object({
  id: z
    .string()
    .describe(
      `The id for the project, which combines with the managing code to make a unique id`,
    ),
  description: z.string().describe(`The capital project title.`),
  managingCode: z
    .string()
    .describe(`Three character string of numbers representing managing agency`)
    .regex(new RegExp("^([0-9]{3})$")),
  managingAgencyInitials: z
    .string()
    .describe(`The managing agency name abbreviation or acronym`),
  minDate: z.any().describe(`The starting date of the capital project`),
  maxDate: z.any().describe(`The ending date of the capital project`),
  category: z.lazy(() => capitalProjectCategorySchema).schema.optional(),
});
