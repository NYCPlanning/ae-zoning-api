import { pgTable, text, uuid, check } from "drizzle-orm/pg-core";
import z from "zod";
import { sql } from "drizzle-orm";

export const facilityOperator = pgTable(
  "facility_operator",
  {
    id: uuid("id").primaryKey(),
    abbreviation: text("abbreviation"),
    name: text("name"),
    type: text("type"),
  },
  (table) => [
    check(
      "facility_operator_type_options",
      sql`${table.type} IN (
      'Public',
      'Non-public'
    )`,
    ),
  ],
);

export const facilityOperatorTypeEntitySchema = z.enum([
  "Public",
  "Non-public",
]);

export type FacilityOperatorTypeEntity = z.infer<
  typeof facilityOperatorTypeEntitySchema
>;

export const facilityOperatorEntitySchema = z.object({
  id: z.string().uuid(),
  abbreviation: z.string(),
  name: z.string(),
  type: facilityOperatorTypeEntitySchema,
});
