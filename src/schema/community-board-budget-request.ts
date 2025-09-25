import {
  check,
  pgTable,
  smallint,
  text,
  char,
  index,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { agency, agencyEntitySchema } from "./agency";
import { sql } from "drizzle-orm";
import { managingCode, managingCodeEntitySchema } from "./managing-code";
import {
  communityDistrict,
  communityDistrictEntitySchema,
} from "./community-district";
import { multiPointGeom, multiPolygonGeom, pointGeom } from "src/drizzle-pgis";
import { boroughEntitySchema } from "./borough";

export const cbbrPolicyArea = pgTable("cbbr_policy_area", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrPolicyAreaEntitySchema = z.object({
  id: z.number().int(),
  description: z.string(),
});

export type CbbrPolicyAreaEntitySchema = z.infer<
  typeof cbbrPolicyAreaEntitySchema
>;

export const cbbrNeedGroup = pgTable("cbbr_need_group", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrNeedGroupEntitySchema = z.object({
  id: z.number().int(),
  description: z.string(),
});

export type CbbrNeedGroupEntitySchema = z.infer<
  typeof cbbrNeedGroupEntitySchema
>;

export const cbbrNeed = pgTable("cbbr_need", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrNeedEntitySchema = z.object({
  id: z.number().int(),
  description: z.string(),
});

export type CbbrNeedEntitySchema = z.infer<typeof cbbrNeedEntitySchema>;

export const cbbrRequest = pgTable("cbbr_request", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  description: text("description").notNull(),
});

export const cbbrRequestEntitySchema = z.object({
  id: z.number().int(),
  description: z.string(),
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

export const cbbrAgencyCategoryResponseEntitySchema = z.object({
  id: z.number().int(),
  description: z.string(),
});

export type CbbrAgencyCategoryResponseEntitySchema = z.infer<
  typeof cbbrAgencyCategoryResponseEntitySchema
>;

export const communityBoardBudgetRequest = pgTable(
  "community_board_budget_request",
  {
    id: text("id").notNull().primaryKey(),
    internalId: text("internal_id").notNull(),
    title: text("title").notNull(),
    boroughId: char("borough_id", { length: 1 }).notNull(),
    communityDistrictId: char("community_district_id", { length: 2 }).notNull(),
    agency: text("agency")
      .notNull()
      .references(() => agency.initials),
    managingCode: char("managing_code", { length: 3 })
      .notNull()
      .references(() => managingCode.id),
    agencyCategoryResponse: smallint("agency_category_response_id").references(
      () => cbbrAgencyCategoryResponse.id,
    ),
    agencyResponse: text("agency_response"),
    requestType: text("request_type").notNull(),
    policyArea: smallint("policy_area_id")
      .references(() => cbbrPolicyArea.id)
      .notNull(),
    needGroup: smallint("need_group_id")
      .references(() => cbbrNeedGroup.id)
      .notNull(),
    priority: smallint("priority").notNull(),
    need: smallint("need_id")
      .notNull()
      .references(() => cbbrNeed.id),
    request: smallint("request_id").references(() => cbbrRequest.id),
    explanation: text("explanation"),
    isLocationSpecific: boolean("is_location_specific").notNull(),
    isContinuedSupport: boolean("is_continued_support").notNull(),
    liFtMPnt: multiPointGeom("li_ft_m_pnt", 2263),
    liFtMPoly: multiPolygonGeom("li_ft_m_poly", 2263),
    mercatorLabel: pointGeom("mercator_label", 3857),
    mercatorFillMPnt: multiPointGeom("mercator_fill_m_pnt", 3857),
    mercatorFillMPoly: multiPolygonGeom("mercator_fill_m_poly", 3857),
  },
  (table) => [
    foreignKey({
      columns: [table.boroughId, table.communityDistrictId],
      foreignColumns: [communityDistrict.boroughId, communityDistrict.id],
    }),
    check(
      "community_board_budget_request_request_type_options",
      sql`${table.requestType} IN (
        'Capital',
        'Expense'
      )`,
    ),
    index().using("GIST", table.liFtMPnt),
    index().using("GIST", table.liFtMPoly),
    index().using("GIST", table.mercatorLabel),
    index().using("GIST", table.mercatorFillMPoly),
    index().using("GIST", table.mercatorFillMPnt),
  ],
);

export const cbbrRequestTypeEntitySchema = z.enum(["Capital", "Expense"]);

export type CbbrRequestTypeEntity = z.infer<typeof cbbrRequestTypeEntitySchema>;

export const communityBoardBudgetRequestEntitySchema = z.object({
  id: z.string(),
  internalId: z.string(),
  title: z.string(),
  boroughId: boroughEntitySchema.shape.id,
  communityDistrictId: communityDistrictEntitySchema.shape.id,
  agency: agencyEntitySchema.shape.initials,
  managingCode: managingCodeEntitySchema.shape.id,
  agencyCategoryReponse:
    cbbrAgencyCategoryResponseEntitySchema.shape.id.nullable(),
  agencyResponse: z.string().nullable(),
  requestType: cbbrRequestTypeEntitySchema,
  policyArea: cbbrPolicyAreaEntitySchema.shape.id,
  needGroup: cbbrNeedGroupEntitySchema.shape.id,
  priority: z.number().int(),
  need: cbbrNeedEntitySchema.shape.id,
  request: cbbrRequestEntitySchema.shape.id,
  explanation: z.string().nullable(),
  isLocationSpecific: z.boolean(),
  isContinuedSupport: z.boolean(),
});

export const communityBoardBudgetRequestPageItemEntitySchema = z.object({
  id: z.string(),
  cbbrPolicyAreaId: z.number(),
  title: z.string(),
  boroughId: z.string(),
  communityDistrictId: z.string(),
  isMapped: z.boolean(),
  isContinuedSupport: z.boolean(),
});
