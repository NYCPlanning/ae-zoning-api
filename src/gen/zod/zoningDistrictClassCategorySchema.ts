import { z } from "zod";

export const zoningDistrictClassCategorySchema = z.enum([
  `Residential`,
  `Commercial`,
  `Manufacturing`,
]);
