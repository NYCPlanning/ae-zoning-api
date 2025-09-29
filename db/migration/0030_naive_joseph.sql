CREATE MATERIALIZED VIEW "public"."capital_project_aggregated" AS (select "capital_project"."id", "capital_project"."managing_code", ARRAY_AGG(DISTINCT "agency_budget"."sponsor") as "sponsoring_agencies", ARRAY_AGG(DISTINCT "agency_budget"."type") as "budget_types", SUM("capital_commitment_fund"."value")::double precision as "commitments_total", ARRAY_AGG(DISTINCT "capital_commitment"."budget_line_code") as "agency_budgets",
        CASE
          WHEN "capital_project"."mercator_fill_m_poly" IS NOT NULL
            THEN "capital_project"."mercator_fill_m_poly"
          WHEN "capital_project"."mercator_fill_m_pnt" IS NOT NULL
            THEN "capital_project"."mercator_fill_m_pnt"
        END as "mercator_fill", "capital_project"."mercator_label" from "capital_project" left join "capital_commitment" on ("capital_commitment"."capital_project_id" = "capital_project"."id" and "capital_commitment"."managing_code" = "capital_project"."managing_code") left join "agency_budget" on "agency_budget"."code" = "capital_commitment"."budget_line_code" left join "capital_commitment_fund" on "capital_commitment_fund"."capital_commitment_id" = "capital_commitment"."id" where "capital_commitment_fund"."capital_fund_category" = 'total' group by "capital_project"."id", "capital_project"."managing_code", "capital_project"."managing_agency", "capital_project"."mercator_fill_m_pnt", "capital_project"."mercator_fill_m_poly");
        --> statement-breakpoint
        CREATE INDEX IF NOT EXISTS "capital_project_aggregated_id" ON "capital_project_aggregated" ("id");--> statement-breakpoint
        CREATE INDEX IF NOT EXISTS "capital_project_aggregated_managing_code" ON "capital_project_aggregated" ("managing_code");--> statement-breakpoint
        CREATE INDEX IF NOT EXISTS "capital_project_aggregated_mercator_fill" ON "capital_project_aggregated" USING GIST ("mercator_fill");--> statement-breakpoint
        CREATE INDEX IF NOT EXISTS "capital_project_aggregated_mercator_label" ON "capital_project_aggregated" USING GIST ("mercator_label");--> statement-breakpoint
