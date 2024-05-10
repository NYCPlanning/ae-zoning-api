import {
  char,
  pgTable,
  text,
  date,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { managingCode, managingCodeEntitySchema } from "./managing-code";
import { agencyEntitySchema } from "./agency";
import { z } from "zod";

export const projectCategoryEnum = pgEnum("project_category", [
  "Fixed Asset",
  "Lump Sum",
  "ITT, Vehicles and Equipment",
]);

export const project = pgTable(
  "project",
  {
    managingCode: char("managing_code", { length: 3 }).references(
      () => managingCode.id,
    ),
    id: text("id"),
    managingAgency: text("managing_agency"),
    description: text("description"),
    minDate: date("min_date"),
    maxDate: date("max_date"),
    category: projectCategoryEnum("project_category"),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.managingCode, table.id] }),
    };
  },
);

export const projectEntitySchema = z.object({
  managingCode: managingCodeEntitySchema,
  id: z.string(),
  managingAgency: agencyEntitySchema,
  description: z.string(),
  minDate: z.date(),
  maxDate: z.date(),
  category: z.string(),
});
