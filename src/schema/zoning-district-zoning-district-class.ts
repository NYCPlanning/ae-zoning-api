import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { zoningDistrict, zoningDistrictClass } from "./index";

export const zoningDistrictZoningDistrictClass = pgTable(
  "zoning_district_zoning_district_class",
  {
    zoningDistrictId: uuid("zoning_district_id")
      .notNull()
      .references(() => zoningDistrict.id),
    zoningDistrictClassId: text("zoning_district_class_id")
      .notNull()
      .references(() => zoningDistrictClass.id),
  },
);
