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
import { project } from "./project";

export const projectCheckbook = pgTable(
  "project_checkbook",
  {
    id: uuid("id").primaryKey(),
    managingCode: char("managing_code", { length: 3 }),
    projectId: text("project_id"),
    value: numeric("value"),
  },
  (table) => {
    return {
      fk: foreignKey({
        columns: [table.managingCode, table.projectId],
        foreignColumns: [project.managingCode, project.id],
        name: "custom_fk",
      }),
    };
  },
);

export const projectCategoryEntitySchema = z.object({
  id: z.string().uuid(),
  managingCode: managingCodeEntitySchema,
  projectId: z.string(),
  value: z.number(),
});

export type ProjectCheckbookEntitySchema = z.infer<
  typeof projectCategoryEntitySchema
>;
