import {
  char,
  index,
  pgTable,
  text,
  date,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { managingCode, managingCodeEntitySchema } from "./managing-code";
import { agency, agencyEntitySchema } from "./agency";
import { z } from "zod";
import { multiPointGeom, multiPolygonGeom, pointGeom } from "src/drizzle-pgis";

export const capitalProjectCategoryEnum = pgEnum("capital_project_category", [
  "Fixed Asset",
  "Lump Sum",
  "ITT, Vehicles and Equipment",
]);

export const capitalProject = pgTable(
  "capital_project",
  {
    managingCode: char("managing_code", { length: 3 }).references(
      () => managingCode.id,
    ),
    id: text("id"),
    managingAgency: text("managing_agency").references(() => agency.initials),
    description: text("description"),
    minDate: date("min_date"),
    maxDate: date("max_date"),
    category: capitalProjectCategoryEnum("category"),
    liFtMPnt: multiPointGeom("li_ft_m_pnt", 2263),
    liFtMPoly: multiPolygonGeom("li_ft_m_poly", 2263),
    mercatorLabel: pointGeom("mercator_label", 3857),
    mercatorFillMPnt: multiPointGeom("mercator_fill_m_pnt", 3857),
    mercatorFillMPoly: multiPolygonGeom("mercator_fill_m_poly", 3857),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.managingCode, table.id] }),
      mercatorFillMPolyGix: index().using("GIST", table.mercatorFillMPoly),
      mercatorFillMPntGix: index().using("GIST", table.mercatorFillMPnt),
    };
  },
);

export const capitalProjectEntitySchema = z.object({
  managingCode: managingCodeEntitySchema,
  id: z.string(),
  managingAgency: agencyEntitySchema,
  description: z.string(),
  minDate: z.date(),
  maxDate: z.date(),
  category: z.string(),
});
