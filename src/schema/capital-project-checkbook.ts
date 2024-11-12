import {
  char,
  foreignKey,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { managingCodeEntitySchema } from "./managing-code";
import { capitalProject } from "./capital-project";

export const capitalProjectCheckbook = pgTable(
  "capital_project_checkbook",
  {
    id: uuid("id").primaryKey(),
    managingCode: char("managing_code", { length: 3 }),
    capitalProjectId: text("capital_project_id"),
    value: numeric("value"),
  },
  (table) => [
    foreignKey({
      columns: [table.managingCode, table.capitalProjectId],
      foreignColumns: [capitalProject.managingCode, capitalProject.id],
      name: "custom_fk",
    }),
  ],
);

export const capitalProjectCategoryEntitySchema = z.object({
  id: z.string().uuid(),
  managingCode: managingCodeEntitySchema,
  capitalProjectId: z.string(),
  value: z.number(),
});

export type CapitalProjectCheckbookEntitySchema = z.infer<
  typeof capitalProjectCategoryEntitySchema
>;
