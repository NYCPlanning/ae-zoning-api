import { pgTable, char, integer } from "drizzle-orm/pg-core";
import { z } from "zod";

export const housingGrowthCd = pgTable("housing_growth_cd", {
  geography_id: char("geography_id", { length: 3 }).primaryKey(),
  units_2020_census: integer("units_2020_census").notNull(),
  units_2020: integer("units_2020").notNull(),
  completed_units_previous_10_years: integer(
    "completed_units_previous_10_years",
  ).notNull(),
  completed_units_since_census: integer(
    "completed_units_since_census",
  ).notNull(),
  units_current: integer("units_current").notNull(),
  projected_completed_units_next_10_years: integer(
    "projected_completed_units_next_10_years",
  ).notNull(),
  projected_units_in_10_years: integer("projected_units_in_10_years").notNull(),
});

export const housingGrowthNta = pgTable("housing_growth_nta", {
  geography_id: char("geography_id", { length: 6 }).primaryKey(),
  units_2020_census: integer("units_2020_census").notNull(),
  units_2020: integer("units_2020").notNull(),
  completed_units_previous_10_years: integer(
    "completed_units_previous_10_years",
  ).notNull(),
  completed_units_since_census: integer(
    "completed_units_since_census",
  ).notNull(),
  units_current: integer("units_current").notNull(),
  projected_completed_units_next_10_years: integer(
    "projected_completed_units_next_10_years",
  ).notNull(),
  projected_units_in_10_years: integer("projected_units_in_10_years").notNull(),
});

const housingGrowthEntitySchema = {
  units2020Census: z.number().int(),
  units2020: z.number().int(),
  completedUnitsPrevious10Years: z.number().int(),
  completedUnitsSinceCensus: z.number().int(),
  unitsCurrent: z.number().int(),
  projectedCompletedUnitsNext10Years: z.number().int(),
  projectedUnitsIn10Years: z.number().int(),
};

export const housingGrowthCdEntitySchema = z.object({
  geoId: z.number().int(),
  ...housingGrowthEntitySchema,
});

export const housingGrowthNtaEntitySchema = z.object({
  geoId: z.string(),
  ...housingGrowthEntitySchema,
});

export type HousingGrowthCdEntitySchema = z.infer<
  typeof housingGrowthCdEntitySchema
>;

export type HousingGrowthNtaEntitySchema = z.infer<
  typeof housingGrowthNtaEntitySchema
>;
