import { z } from "zod";

export const agencySchema = z.object({
  initials: z.coerce
    .string()
    .describe(
      "A string of variable length containing the initials of the agency.",
    ),
  name: z.coerce.string().describe("The full name of the agency."),
});
