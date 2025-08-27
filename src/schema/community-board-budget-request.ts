import { char, check, pgTable, smallint, text } from "drizzle-orm/pg-core";
import { agency } from "./agency";
import { sql } from "drizzle-orm";
import { borough } from "./borough";
import { communityDistrict } from "./community-district";
import { managingCode } from "./managing-code";
import { geometryCollectionGeom } from "src/drizzle-pgis";

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

export const cbbrRequest = pgTable("cbbr_request", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrOptionCascade = pgTable(
  "cbbr_option_cascade",
  {
    policyAreaId: smallint("policy_area_id")
      .notNull()
      .references(() => cbbrPolicyArea.id),
    needGroupId: smallint("need_group_id")
      .notNull()
      .references(() => cbbrNeedGroup.id),
    agencyInitials: text("agency_initials")
      .notNull()
      .references(() => agency.initials),
    type: text("type").notNull(),
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

export const cbbrAgencyCategoryResponse = pgTable(
  "cbbr_agency_category_response",
  {
    id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
    description: text("description").notNull(),
  },
);

export const communityBoardBudgetRequest = pgTable(
  "community_board_budget_requests",
  {
    id: text("id").notNull(),
    trackingCode: text("tracking_code").notNull(),
    boroughId: char("borough_id", { length: 1 })
      .notNull()
      .references(() => borough.id),
    communityDistrictId: char("community_district_id", { length: 2 })
      .notNull()
      .references(() => communityDistrict.id),
    agency: text("agency")
      .notNull()
      .references(() => agency.initials),
    managingCode: char("managing_code", { length: 3 })
      .notNull()
      .references(() => managingCode.id),
    agencyCategoryResponse: text("agency_category_response")
      .notNull()
      .references(() => cbbrAgencyCategoryResponse.description),
    agencyResponse: text("agency_response").notNull(),
    requestType: text("requestType").notNull(),
    priority: smallint("priority").notNull(),
    need: smallint("need_id")
      .notNull()
      .references(() => cbbrNeed.id),
    request: smallint("request_id")
      .notNull()
      .references(() => cbbrRequest.id),
    explanation: text("explanation").notNull(),
    isLocationSpecific: text("is_location_specific").notNull(),
    geom: geometryCollectionGeom("geom", 4326),
  },
);
