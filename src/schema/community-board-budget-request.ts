import {
  check,
  pgTable,
  smallint,
  text,
  char,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";
import { agency } from "./agency";
import { sql } from "drizzle-orm";
import { managingCode } from "./managing-code";
import { communityDistrict } from "./community-district";
import { borough } from "./borough";
import { multiPointGeom, multiPolygonGeom } from "src/drizzle-pgis";

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
  "community_board_budget_request",
  {
    id: text("id").notNull(),
    trackingCode: text("tracking_code").notNull(),
    boroughId: char("borough_id", { length: 1 })
      .notNull()
      .references(() => borough.id),
    communityDistrictId: char("community_district_id", { length: 2 }).notNull(),
    agency: text("agency")
      .notNull()
      .references(() => agency.initials),
    managingCode: char("managing_code", { length: 3 })
      .notNull()
      .references(() => managingCode.id),
    agencyCategoryResponse: smallint("agency_category_response_id")
      .notNull()
      .references(() => cbbrAgencyCategoryResponse.id),
    agencyResponse: text("agency_response"),
    requestType: text("request_type").notNull(),
    priority: smallint("priority").notNull(),
    need: smallint("need_id")
      .notNull()
      .references(() => cbbrNeed.id),
    request: smallint("request_id").references(() => cbbrRequest.id),
    explanation: text("explanation"),
    isLocationSpecific: boolean("is_location_specific").notNull(),
    liFtMPnt: multiPointGeom("li_ft_m_pnt", 2263),
    liFtMPoly: multiPolygonGeom("li_ft_m_poly", 2263),
    mercatorFillMPnt: multiPointGeom("mercator_fill_m_pnt", 3857),
    mercatorFillMPoly: multiPolygonGeom("mercator_fill_m_poly", 3857),
  },
  (table) => [
    foreignKey({
      columns: [table.boroughId, table.communityDistrictId],
      foreignColumns: [communityDistrict.boroughId, communityDistrict.id],
    }),
  ],
);
