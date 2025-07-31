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
  policyAreaId: smallint("policy_area_id")
    .notNull()
    .references(() => cbbrPolicyArea.id),
});

export const cbbrAgencyNeedGroup = pgTable("cbbr_agency_need_group", {
  agencyInitials: text("agency_initials")
    .notNull()
    .references(() => agency.initials),
  needGroupId: smallint("need_group_id")
    .notNull()
    .references(() => cbbrNeedGroup.id),
});

export const cbbrNeed = pgTable("cbbr_need", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrAgencyNeed = pgTable("cbbr_agency_need", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  agencyInitials: text("agency_initials")
    .notNull()
    .references(() => agency.initials),
  needId: smallint("need_id")
    .notNull()
    .references(() => cbbrNeed.id),
});

export const cbbrRequest = pgTable(
  "cbbr_request",
  {
    id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
    description: text("description").notNull(),
    type: text("type").notNull(),
  },
  (table) => [
    check(
      "cbbr_request_type_options",
      sql`${table.type} IN ('Capital', 'Expense')`,
    ),
  ],
);

export const cbbrAgencyNeedRequest = pgTable("cbbr_agency_need_request", {
  agencyNeedId: smallint("agency_need_id")
    .notNull()
    .references(() => cbbrAgencyNeed.id),
  requestId: smallint("request_id")
    .notNull()
    .references(() => cbbrRequest.id),
});
