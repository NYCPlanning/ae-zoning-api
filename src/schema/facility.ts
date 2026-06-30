import {
  char,
  check,
  index,
  pgTable,
  smallint,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import z from "zod";
import { facilityOperator } from "./facility-operator";
import { agency, agencyEntitySchema } from "./agency";
import { multiPointGeom } from "src/drizzle-pgis";
import { sql } from "drizzle-orm";
import { dataSource, dataSourceEntitySchema } from "./data-source";

export const facilityDomain = pgTable("facility_domain", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  description: text("description").notNull(),
});

export const facilityDomainEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  shortName: z.string().nullable(),
  description: z.string(),
});

export type FacilityDomainEntitySchema = z.infer<
  typeof facilityDomainEntitySchema
>;

export const facilityGroup = pgTable("facility_group", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  facilityDomainId: smallint("facility_domain_id")
    .notNull()
    .references(() => facilityDomain.id),
});

export const facilityGroupEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  facilityDomainId: facilityDomainEntitySchema.shape.id,
});

export type FacilityGroupEntitySchema = z.infer<
  typeof facilityGroupEntitySchema
>;

export const facilitySubgroup = pgTable("facility_subgroup", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name"),
  description: text("description"),
  facilityGroupId: smallint("facility_group_id")
    .notNull()
    .references(() => facilityGroup.id),
});

export const facilitySubgroupEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  facilityGroupId: facilityGroupEntitySchema.shape.id,
});

export type FacilitySubgroupEntitySchema = z.infer<
  typeof facilitySubgroupEntitySchema
>;

export const facilityType = pgTable("facility_type", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name"),
  facilitySubgroupId: smallint("facility_subgroup_id")
    .notNull()
    .references(() => facilitySubgroup.id),
});

export const facilityTypeEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  facilitySubgroupId: facilitySubgroupEntitySchema.shape.id,
});

export type FacilityTypeEntitySchema = z.infer<typeof facilityTypeEntitySchema>;

export const facility = pgTable(
  "facility",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    address: text("address"),
    addressNumber: text("address_number"),
    streetName: text("street_name"),
    city: text("city"),
    zipCode: text("zip_code"),
    facilityTypeId: smallint("facility_type_id")
      .notNull()
      .references(() => facilityType.id),
    serviceArea: text("service_area").notNull(),
    facilityOperatorId: uuid("facility_operator_id").references(
      () => facilityOperator.id,
    ),
    overseeingAgencyInitials: text("overseeing_agency_initials").references(
      () => agency.initials,
    ),
    capacity: smallint("capacity"),
    capacityType: text("capacity_type"),
    sgrLtr: char("sgr_ltr", { length: 1 }),
    sgrArcLtr: char("sgr_arc_ltr", { length: 1 }),
    sgrSysLtr: char("sgr_sys_ltr", { length: 1 }),
    sgrYear: smallint("sgr_year"),
    bin: char("bin", { length: 7 }),
    bbl: char("bbl", { length: 10 }),
    liFt: multiPointGeom("li_ft", 2263),
    mercator: multiPointGeom("mercator", 3857),
    dataSourceSchema: text("data_source_schema").references(
      () => dataSource.schemaName,
    ),
  },
  (table) => [
    index().using("GIST", table.liFt),
    index().using("GIST", table.mercator),
    check(
      "facility_service_area_options",
      sql`${table.serviceArea} IN (
        'Local',
        'Regional'
      )`,
    ),
  ],
);

export const facilityEntitySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  address: z.string(),
  bin: z.string().regex(RegExp("^([0-9]{7})$")).nullable(),
  bbl: z.string().regex(RegExp("^([0-9]{10})$")).nullable(),
  oversightAgencyInitials: agencyEntitySchema.shape.initials.nullable(),
  facilityJurisdiction: z.string().nullable(),
  facilityOperatorType: z.string().nullable(),
  operatorName: z.string().nullable(),
  categoryId: z.number().nullable(),
  categoryGroupId: z.number().nullable(),
  categorySubgroupId: z.number().nullable(),
  position: z.array(z.number()),
  sgrLtr: z.string().nullable(),
  sgrArcLtr: z.string().nullable(),
  sgrSysLtr: z.string().nullable(),
  sgrYear: z.number().nullable(),
  dataSource: dataSourceEntitySchema,
  alsoAtLocation: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      categoryId: z.number().nullable(),
    }),
  ),
});

export const facilityPageItemEntitySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  oversightAgencyInitials: agencyEntitySchema.shape.initials.nullable(),
  categoryId: z.number().nullable(),
  hasSogrData: z.boolean(),
});

export const facilityDomainRelations = relations(
  facilityDomain,
  ({ many }) => ({
    groups: many(facilityGroup),
  }),
);

export const facilityGroupRelations = relations(
  facilityGroup,
  ({ one, many }) => ({
    categories: one(facilityDomain, {
      fields: [facilityGroup.facilityDomainId],
      references: [facilityDomain.id],
    }),
    subgroups: many(facilitySubgroup),
  }),
);

export const facilitySubgroupRelations = relations(
  facilitySubgroup,
  ({ one }) => ({
    groups: one(facilityGroup, {
      fields: [facilitySubgroup.facilityGroupId],
      references: [facilityGroup.id],
    }),
  }),
);
