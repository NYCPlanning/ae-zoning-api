CREATE TABLE IF NOT EXISTS "tax_lot" (
	"bbl" char(10) PRIMARY KEY NOT NULL,
	"borough_id" char(1) NOT NULL,
	"block" text NOT NULL,
	"lot" text NOT NULL,
	"address" text,
	"land_use_id" char(2),
	"wgs84" geography(multiPolygon, 4326) NOT NULL,
	"li_ft" geometry(multiPolygon,2263) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tax_lot" ADD CONSTRAINT "tax_lot_borough_id_borough_id_fk" FOREIGN KEY ("borough_id") REFERENCES "borough"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tax_lot" ADD CONSTRAINT "tax_lot_land_use_id_land_use_id_fk" FOREIGN KEY ("land_use_id") REFERENCES "land_use"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
