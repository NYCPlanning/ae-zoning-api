import { z } from "zod";

export const zoningDistrictSchema = z.object({
  id: z.coerce.string().uuid().describe("An automatically generated uuid."),
  label: z.coerce
    .string()
    .describe(
      "The zoning codes that apply to the district. Multiple codes are concatenated with a slash.",
    ),
});
