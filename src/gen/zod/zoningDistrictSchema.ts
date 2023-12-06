import { z } from "zod";

export const zoningDistrictSchema = z.object({
  id: z.string().describe(`An automatically generated uuid.`).uuid(),
  label: z
    .string()
    .describe(
      `The zoning codes that apply to the district. Multiple codes are concatenated with a slash.`,
    ),
});
