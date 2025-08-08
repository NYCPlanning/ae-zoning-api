import { check, pgTable, smallint, text } from "drizzle-orm/pg-core";
import { agency } from "./agency";
import { sql } from "drizzle-orm";

export const cbbrPolicyArea = pgTable("cbbr_policy_area", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrNeedGroup = pgTable("cbbr_need_group", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrNeed = pgTable("cbbr_need", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrRequest = pgTable(
  "cbbr_request",
  {
    id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
    description: text("description").notNull(),
  });

export const cbbrOptionsCascade = pgTable("cbbr_options_cascade", {
  policyAreaId: smallint("policy_area_id")
    .notNull()
    .references(() => cbbrPolicyArea.id),
  needGroupId: smallint("need_group_id")
    .notNull()
    .references(() => cbbrNeedGroup.id),
  agencyInitials: text("agency_initials")
    .notNull()
    .references(() => agency.initials),
  type: text("type")
    .notNull(),
  needId: smallint("need_id")
    .notNull()
    .references(() => cbbrNeed.id),
  requestId: smallint("request_id")
    .notNull()
    .references(() => cbbrRequest.id),
}, 
(table) => [
    check(
      "cbbr_request_type_options",
      sql`${table.type} IN ('Capital', 'Expense')`,
    ),
  ],
);
