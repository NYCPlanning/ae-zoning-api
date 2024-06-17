import { z } from "zod";

/**
 * @description The type of Capital Project.
 */
export const capitalProjectCategorySchema = z
  .enum(["Fixed Asset", "Lump Sum", "ITT, Vehicles and Equipment"])
  .describe("The type of Capital Project.")
  .nullable();
