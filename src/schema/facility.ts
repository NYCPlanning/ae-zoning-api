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
import { agency } from "./agency";

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
    facilityType: text("facility_type").notNull(),
    serviceArea: text("service_area"),
    facilityOperatorInitials: text("facility_operator_initials"),
    overseeingAgencyInitials: text("overseeing_agency_initials").references(
      () => agency.initials,
    ),
    capacity: smallint("capacity"),
    capacityType: text("capacity_type"),
    bin: char("bin", { length: 7 }),
    bbl: char("bbl", { length: 10 }),
    liFt: multiPointGeom("li_ft", 2263),
    mercator: multiPointGeom("mercator", 3857),
    dataSource: text("data_source"),
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
  facilityDomainId: z.string(),
  facilityGroupId: z.string(),
  facilitySubgroupId: z.string(),
  serviceArea: z.string(),
  facilityOperatorInitials: z.string(),
  overseeingAgencyInitials: z.string(),
  overseeingLevel: z.string(),
  capacity: z.number().int(),
  capacityType: z.string(),
  bin: z.string().regex(RegExp("^([0-9]{7})$")),
  bbl: z.string().regex(RegExp("^([0-9]{10})$")),
  dataSource: z.string(),
  facilityType: z.string(),
});
