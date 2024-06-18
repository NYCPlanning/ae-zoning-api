import { z } from "zod";

/**
 * @description The type of zoning district.
 */
export const zoningDistrictClassCategorySchema = z
  .enum(["Residential", "Commercial", "Manufacturing"])
  .describe("The type of zoning district.");
