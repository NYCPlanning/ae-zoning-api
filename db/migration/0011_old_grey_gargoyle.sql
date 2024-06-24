ALTER TABLE "captial_commitment" RENAME TO "capital_commitment";--> statement-breakpoint
ALTER TABLE "capital_commitment_fund" DROP CONSTRAINT "capital_commitment_fund_capital_commitment_id_captial_commitment_id_fk";
--> statement-breakpoint
ALTER TABLE "capital_commitment" DROP CONSTRAINT "captial_commitment_type_capital_commitment_type_code_fk";
--> statement-breakpoint
ALTER TABLE "capital_commitment" DROP CONSTRAINT "captial_commitment_managing_code_capital_project_id_capital_project_managing_code_id_fk";
--> statement-breakpoint
ALTER TABLE "capital_commitment" DROP CONSTRAINT "captial_commitment_budget_line_code_budget_line_id_budget_line_code_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_commitment_fund" ADD CONSTRAINT "capital_commitment_fund_capital_commitment_id_capital_commitment_id_fk" FOREIGN KEY ("capital_commitment_id") REFERENCES "public"."capital_commitment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_commitment" ADD CONSTRAINT "capital_commitment_type_capital_commitment_type_code_fk" FOREIGN KEY ("type") REFERENCES "public"."capital_commitment_type"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_commitment" ADD CONSTRAINT "capital_commitment_managing_code_capital_project_id_capital_project_managing_code_id_fk" FOREIGN KEY ("managing_code","capital_project_id") REFERENCES "public"."capital_project"("managing_code","id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "capital_commitment" ADD CONSTRAINT "capital_commitment_budget_line_code_budget_line_id_budget_line_code_id_fk" FOREIGN KEY ("budget_line_code","budget_line_id") REFERENCES "public"."budget_line"("code","id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
