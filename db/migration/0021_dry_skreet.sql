ALTER TABLE "capital_project" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "capital_project" ADD CONSTRAINT "capital_project_category_options" CHECK ("capital_project"."category" IN (
          'Fixed Asset',
          'Lump Sum',
          'ITT, Vehicles, and Equipment'
          ));