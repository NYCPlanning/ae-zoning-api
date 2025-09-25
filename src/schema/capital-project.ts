import {
  char,
  index,
  pgTable,
  text,
  date,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import { managingCode, managingCodeEntitySchema } from "./managing-code";
import { agency, agencyEntitySchema } from "./agency";
import { z } from "zod";
import { multiPointGeom, multiPolygonGeom, pointGeom } from "src/drizzle-pgis";
import { sql } from "drizzle-orm";
import { capitalProjectCategorySchema } from "src/gen";
import { geom } from "src/drizzle-pgis/geometry";

export const capitalProject = pgTable(
  "capital_project",
  {
    managingCode: char("managing_code", { length: 3 })
      .references(() => managingCode.id)
      .notNull(),
    id: text("id").notNull(),
    managingAgency: text("managing_agency")
      .references(() => agency.initials)
      .notNull(),
    description: text("description").notNull(),
    minDate: date("min_date").notNull(),
    maxDate: date("max_date").notNull(),
    category: text("category"),
    liFtMPnt: multiPointGeom("li_ft_m_pnt", 2263),
    liFtMPoly: multiPolygonGeom("li_ft_m_poly", 2263),
    mercatorLabel: pointGeom("mercator_label", 3857),
    mercatorFill: geom("mercator_fill", 3857),
    mercatorFillMPnt: multiPointGeom("mercator_fill_m_pnt", 3857),
    mercatorFillMPoly: multiPolygonGeom("mercator_fill_m_poly", 3857),
  },
  (table) => [
    primaryKey({ columns: [table.managingCode, table.id] }),
    index().using("GIST", table.mercatorFillMPoly),
    index().using("GIST", table.mercatorFillMPnt),
    index().using("GIST", table.liFtMPnt),
    index().using("GIST", table.liFtMPoly),
    check(
      "capital_project_category_options",
      sql`${table.category} IN (
          'Fixed Asset',
          'Lump Sum',
          'ITT, Vehicles, and Equipment'
          )`,
    ),
  ],
);

export const capitalProjectEntitySchema = z.object({
  managingCode: managingCodeEntitySchema.shape.id,
  id: z.string(),
  managingAgency: agencyEntitySchema.shape.initials,
  description: z.string(),
  minDate: z.string().date(),
  maxDate: z.string().date(),
  category: capitalProjectCategorySchema,
});
