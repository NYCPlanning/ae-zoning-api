import { pgTable, smallint, text } from "drizzle-orm/pg-core";
import z from "zod";

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
