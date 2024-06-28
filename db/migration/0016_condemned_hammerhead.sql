ALTER TABLE "agency_budget" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "agency_budget" ALTER COLUMN "sponsor" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_commitment_fund" ALTER COLUMN "value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_commitment" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_commitment" ALTER COLUMN "planned_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_commitment" ALTER COLUMN "budget_line_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_commitment" ALTER COLUMN "budget_line_id" SET NOT NULL;