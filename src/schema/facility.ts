import {
  pgTable,
  smallint,
  text,
  char,
  index,
  check,
} from "drizzle-orm/pg-core";
import { multiPointGeom } from "src/drizzle-pgis";
import z from "zod";
import { sql } from "drizzle-orm";
import { agency, agencyEntitySchema } from "./agency";
import {
  facilityOperator,
  facilityOperatorEntitySchema,
} from "./facility-operator";

export const facilityDomain = pgTable("facility_domain", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name"),
  description: text("description"),
});

export const facilityDomainEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
});

export type FacilityDomainEntitySchema = z.infer<
  typeof facilityDomainEntitySchema
>;

export const facilityGroup = pgTable("facility_group", {
  id: smallint("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name"),
  description: text("description"),
  facilityDomainId: smallint("facility_domain_id")
    .notNull()
    .references(() => facilityDomain.id),
});

export const facilityGroupEntitySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
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
    zipcode: text("zipcode"),
    facilityTypeId: smallint("facility_type_id")
      .notNull()
      .references(() => facilityType.id),
    serviceArea: text("service_area"),
    facilityOperatorId: text("facility_operator_initials").references(
      () => facilityOperator.id,
    ),
    overseeingAgencyInitials: text("overseeing_agency_initials").references(
      () => agency.initials,
    ),
    capacity: smallint("capacity"),
    capacityType: text("capacity_type"),
    bin: char("bin", { length: 7 }),
    bbl: char("bbl", { length: 10 }),
    liFt: multiPointGeom("li_ft", 2263),
    mercator: multiPointGeom("mercator", 3857),
    // dataSourceId: text("data_source_id").references(() => dataSource.id),
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
  name: z.string(),
  address: z.string(),
  addressNumber: z.string(),
  streetName: z.string(),
  city: z.string(),
  zipcode: z.string(),
  facilityTypeId: facilityTypeEntitySchema.shape.id,
  serviceArea: z.string(),
  facilityOperatorId: facilityOperatorEntitySchema.shape.id,
  overseeingAgencyInitials: agencyEntitySchema.shape.initials,
  overseeingLevel: z.string(),
  capacity: z.number().int(),
  capacityType: z.string(),
  bin: z.string().regex(RegExp("^([0-9]{7})$")),
  bbl: z.string().regex(RegExp("^([0-9]{10})$")),
  dataSource: z.string(),
});
