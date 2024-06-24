ALTER TABLE "capital_project" ALTER COLUMN "managing_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_project" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_project" ALTER COLUMN "managing_agency" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_project" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_project" ALTER COLUMN "min_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "capital_project" ALTER COLUMN "max_date" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "capital_project_li_ft_m_pnt_index" ON "capital_project" USING GIST ("li_ft_m_pnt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "capital_project_li_ft_m_poly_index" ON "capital_project" USING GIST ("li_ft_m_poly");