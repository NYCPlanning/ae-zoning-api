ALTER TABLE "zoning_district_class" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "zoning_district_class" ADD CONSTRAINT "zoning_district_class_category_options" CHECK ("zoning_district_class"."category" IN ('Residential', 'Commercial', 'Manufacturing'));--> statement-breakpoint
DROP TYPE "public"."category";