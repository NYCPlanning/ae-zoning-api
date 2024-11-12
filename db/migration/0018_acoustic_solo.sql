ALTER TABLE "capital_project_fund" ALTER COLUMN "stage" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "capital_project_fund" ADD CONSTRAINT "capital_project_fund_stage_options" CHECK ("capital_project_fund"."stage" IN ('adopt', 'allocate', 'commit', 'spent'));--> statement-breakpoint
DROP TYPE "public"."capital_project_fund_stage";