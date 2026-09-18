CREATE TABLE "housing_growth_cd" (
	"geography_id" char(3) PRIMARY KEY NOT NULL,
	"units_2020_census" integer NOT NULL,
	"units_2020" integer NOT NULL,
	"completed_units_previous_10_years" integer NOT NULL,
	"completed_units_since_census" integer NOT NULL,
	"units_current" integer NOT NULL,
	"projected_completed_units_next_10_years" integer NOT NULL,
	"projected_units_in_10_years" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "housing_growth_nta" (
	"geography_id" char(6) PRIMARY KEY NOT NULL,
	"units_2020_census" integer NOT NULL,
	"units_2020" integer NOT NULL,
	"completed_units_previous_10_years" integer NOT NULL,
	"completed_units_since_census" integer NOT NULL,
	"units_current" integer NOT NULL,
	"projected_completed_units_next_10_years" integer NOT NULL,
	"projected_units_in_10_years" integer NOT NULL
);
