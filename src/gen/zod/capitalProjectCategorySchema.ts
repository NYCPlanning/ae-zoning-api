import { z } from "zod";

export const capitalProjectCategorySchema = z.enum([
  `Fixed Asset`,
  `Lump Sum`,
  `ITT, Vehicles and Equipment`,
]);
