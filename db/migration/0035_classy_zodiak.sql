ALTER TABLE "agency" ADD COLUMN "oversight_level" text;--> statement-breakpoint
ALTER TABLE "agency" ADD CONSTRAINT "agency_oversight_level_options" CHECK ("agency"."oversight_level" IN (
          'Federal',
          'State',
          'County',
          'City'
          ));