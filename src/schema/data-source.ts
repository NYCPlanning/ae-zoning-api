import { date, pgTable, text } from "drizzle-orm/pg-core";
import { z } from "zod";

export const dataSource = pgTable("data_source", {
  schemaName: text("schema_name").primaryKey(),
  datasetName: text("dataset_name"),
  version: text("version").notNull(),
  retrieveDate: date("retrieve_date").notNull(),
});

export const dataSourceEntitySchema = z.object({
  schemaName: z.string(),
  datasetName: z.string(),
  version: z.string(),
  retrieveDate: z.string().date(),
});

export type DataSourceEntitySchema = z.infer<typeof dataSourceEntitySchema>;
