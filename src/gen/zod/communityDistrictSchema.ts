import { z } from "zod";

export const communityDistrictSchema = z.object({
  id: z
    .string()
    .describe(
      `The two character numeric string containing the number used to refer to the community district.`,
    )
    .regex(new RegExp("^([0-9]{2})$")),
  boroughId: z
    .string()
    .describe(
      `A single character numeric string containing the common number used to refer to the borough. Possible values are 1-5.`,
    )
    .regex(new RegExp("^([0-9])$")),
});
