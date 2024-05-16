DO $$ BEGIN
 CREATE TYPE "capital_fund_category" AS ENUM('city-non-exempt', 'city-exempt', 'city-cost', 'non-city-state', 'non-city-federal', 'non-city-other', 'non-city-cost', 'total');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "capital_project_fund_stage" AS ENUM('adopt', 'allocate', 'commit', 'spent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "capital_project_category" AS ENUM('Fixed Asset', 'Lump Sum', 'ITT, Vehicles and Equipment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency_budget" (
	"code" text PRIMARY KEY NOT NULL,
	"type" text,
	"sponsor" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency" (
	"initials" text PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "budget_line" (
	"code" text,
	"id" text,
	CONSTRAINT budget_line_code_id_pk PRIMARY KEY("code","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "capital_commitment_fund" (
	"id" uuid PRIMARY KEY NOT NULL,
	"capital_commitment_id" uuid,
	"capital_fund_category" "capital_fund_category",
	"value" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "capital_commitment_type" (
	"code" char(4) PRIMARY KEY NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "captial_commitment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" char(4),
	"planned_date" date,
	"managing_code" char(3),
	"capital_project_id" text,
	"budget_line_code" text,
	"budget_line_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "capital_project_checkbook" (
	"id" uuid PRIMARY KEY NOT NULL,
	"managing_code" char(3),
	"capital_project_id" text,
	"value" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "capital_project_fund" (
	"id" uuid PRIMARY KEY NOT NULL,
	"managing_code" char(3),
	"capital_project_id" text,
	"capital_fund_category" "capital_fund_category",
	"stage" "capital_project_fund_stage",
	"value" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "capital_project" (
	"managing_code" char(3),
	"id" text,
	"managing_agency" text,
	"description" text,
	"min_date" date,
	"max_date" date,
	"category" "capital_project_category",
	"li_ft_m_pnt" geometry(multiPoint,2263),
	"li_ft_m_poly" geometry(multiPolygon,2263),
	"mercator_label" geometry(point,3857),
	"mercator_fill_m_pnt" geometry(multiPoint,3857),
	"mercator_fill_m_poly" geometry(multiPolygon,3857),
	CONSTRAINT capital_project_managing_code_id_pk PRIMARY KEY("managing_code","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "city_council_district" (
	"id" text PRIMARY KEY NOT NULL,
	"li_ft" geometry(multiPolygon,2263),
	"mercator_fill" geometry(multiPolygon,3857),
	"mercator_label" geometry(point,3857)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_district" (
	"borough_id" char(1),
	"id" char(2),
	"li_ft" geometry(multiPoint,2263),
	"mercator_fill" geometry(multiPolygon,3857),
	"mercator_label" geometry(point,3857),
	CONSTRAINT community_district_borough_id_id_pk PRIMARY KEY("borough_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "managing_code" (
	"id" char(3) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agency_budget" ADD CONSTRAINT "agency_budget_sponsor_agency_initials_fk" FOREIGN KEY ("sponsor") REFERENCES "agency"("initials") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "budget_line" ADD CONSTRAINT "budget_line_code_agency_budget_code_fk" FOREIGN KEY ("code") REFERENCES "agency_budget"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_commitment_fund" ADD CONSTRAINT "capital_commitment_fund_capital_commitment_id_captial_commitment_id_fk" FOREIGN KEY ("capital_commitment_id") REFERENCES "captial_commitment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "captial_commitment" ADD CONSTRAINT "captial_commitment_type_capital_commitment_type_code_fk" FOREIGN KEY ("type") REFERENCES "capital_commitment_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "captial_commitment" ADD CONSTRAINT "captial_commitment_managing_code_capital_project_id_capital_project_managing_code_id_fk" FOREIGN KEY ("managing_code","capital_project_id") REFERENCES "capital_project"("managing_code","id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "captial_commitment" ADD CONSTRAINT "captial_commitment_budget_line_code_budget_line_id_budget_line_code_id_fk" FOREIGN KEY ("budget_line_code","budget_line_id") REFERENCES "budget_line"("code","id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_project_checkbook" ADD CONSTRAINT "custom_fk" FOREIGN KEY ("managing_code","capital_project_id") REFERENCES "capital_project"("managing_code","id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_project_fund" ADD CONSTRAINT "custom_fk" FOREIGN KEY ("managing_code","capital_project_id") REFERENCES "capital_project"("managing_code","id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_project" ADD CONSTRAINT "capital_project_managing_code_managing_code_id_fk" FOREIGN KEY ("managing_code") REFERENCES "managing_code"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_project" ADD CONSTRAINT "capital_project_managing_agency_agency_initials_fk" FOREIGN KEY ("managing_agency") REFERENCES "agency"("initials") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_district" ADD CONSTRAINT "community_district_borough_id_borough_id_fk" FOREIGN KEY ("borough_id") REFERENCES "borough"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
