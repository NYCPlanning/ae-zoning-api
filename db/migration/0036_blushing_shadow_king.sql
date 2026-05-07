ALTER TABLE "agency" ADD COLUMN "oversight_level" text;--> statement-breakpoint
ALTER TABLE "agency" ADD CONSTRAINT "agency_oversight_level" CHECK ("agency"."oversight_level" IS NULL
      OR "agency"."oversight_level" IN ('City', 'County', 'State', 'Federal'));