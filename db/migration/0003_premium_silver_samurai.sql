DO $$ BEGIN
 CREATE TYPE "category" AS ENUM('Residential', 'Commercial', 'Manufacturing');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zoning_district" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"wgs84" geography(multiPolygon, 4326) NOT NULL,
	"li_ft" geometry(multiPolygon,2263) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zoning_district_class" (
	"id" text PRIMARY KEY NOT NULL,
	"category" "category",
	"description" text NOT NULL,
	"url" text,
	"color" char(9) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zoning_district_zoning_district_class" (
	"zoning_district_id" uuid NOT NULL,
	"zoning_district_class_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zoning_district_zoning_district_class" ADD CONSTRAINT "zoning_district_zoning_district_class_zoning_district_id_zoning_district_id_fk" FOREIGN KEY ("zoning_district_id") REFERENCES "zoning_district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zoning_district_zoning_district_class" ADD CONSTRAINT "zoning_district_zoning_district_class_zoning_district_class_id_zoning_district_class_id_fk" FOREIGN KEY ("zoning_district_class_id") REFERENCES "zoning_district_class"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
