CREATE TABLE "facility" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"address" text,
	"address_number" text,
	"street_name" text,
	"city" text,
	"zip_code" text,
	"facility_type_id" smallint NOT NULL,
	"service_area" text NOT NULL,
	"facility_operator_id" uuid,
	"overseeing_agency_initials" text,
	"capacity" smallint,
	"capacity_type" text,
	"bin" char(7),
	"bbl" char(10),
	"li_ft" geometry(multiPoint,2263),
	"mercator" geometry(multiPoint,3857),
	"data_source_schema" text,
	CONSTRAINT "facility_service_area_options" CHECK ("facility"."service_area" IN (
        'Local',
        'Regional'
      ))
);
--> statement-breakpoint
ALTER TABLE "facility" ADD CONSTRAINT "facility_facility_type_id_facility_type_id_fk" FOREIGN KEY ("facility_type_id") REFERENCES "public"."facility_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility" ADD CONSTRAINT "facility_facility_operator_id_facility_operator_id_fk" FOREIGN KEY ("facility_operator_id") REFERENCES "public"."facility_operator"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility" ADD CONSTRAINT "facility_overseeing_agency_initials_agency_initials_fk" FOREIGN KEY ("overseeing_agency_initials") REFERENCES "public"."agency"("initials") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility" ADD CONSTRAINT "facility_data_source_schema_data_source_schema_name_fk" FOREIGN KEY ("data_source_schema") REFERENCES "public"."data_source"("schema_name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "facility_li_ft_index" ON "facility" USING GIST ("li_ft");--> statement-breakpoint
CREATE INDEX "facility_mercator_index" ON "facility" USING GIST ("mercator");