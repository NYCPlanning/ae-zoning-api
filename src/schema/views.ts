import { and, eq, sql } from "drizzle-orm";
import { pgMaterializedView } from "drizzle-orm/pg-core";
import { capitalProject } from "./capital-project";
import { capitalCommitmentFund } from "./capital-commitment-fund";
import { capitalCommitment } from "./capital-commitment";
import { agencyBudget } from "./agency-budget";

export const capitalProjectAggregated = pgMaterializedView(
  "capital_project_aggregated",
).as((qb) =>
  qb
    .select({
      id: capitalProject.id,
      managingCode: capitalProject.managingCode,
      sponsoringAgencies: sql<
        Array<string>
      >`ARRAY_AGG(DISTINCT ${agencyBudget.sponsor})`.as("sponsoring_agencies"),
      budgetTypes: sql<
        Array<string>
      >`ARRAY_AGG(DISTINCT ${agencyBudget.type})`.as("budget_types"),
      commitmentsTotal:
        // numeric type is econded as string, double precision type is encoded in mvt as number
        sql`SUM(${capitalCommitmentFund.value})::double precision`
          .mapWith(Number)
          .as("commitments_total"),
      agencyBudgets: sql<
        Array<string>
      >`ARRAY_AGG(DISTINCT ${capitalCommitment.budgetLineCode})`.as(
        "agency_budgets",
      ),
      mercatorFill: sql<string>`
        CASE
          WHEN ${capitalProject.mercatorFillMPoly} IS NOT NULL
            THEN ${capitalProject.mercatorFillMPoly}
          WHEN ${capitalProject.mercatorFillMPnt} IS NOT NULL
            THEN ${capitalProject.mercatorFillMPnt}
        END`.as("mercator_fill"),
      mercatorLabel: capitalProject.mercatorLabel,
    })
    .from(capitalProject)
    .leftJoin(
      capitalCommitment,
      and(
        eq(capitalCommitment.capitalProjectId, capitalProject.id),
        eq(capitalCommitment.managingCode, capitalProject.managingCode),
      ),
    )
    .leftJoin(
      agencyBudget,
      eq(agencyBudget.code, capitalCommitment.budgetLineCode),
    )
    .leftJoin(
      capitalCommitmentFund,
      eq(capitalCommitmentFund.capitalCommitmentId, capitalCommitment.id),
    )
    .where(eq(capitalCommitmentFund.category, "total"))
    .groupBy(
      capitalProject.id,
      capitalProject.managingCode,
      capitalProject.managingAgency,
      capitalProject.mercatorFillMPnt,
      capitalProject.mercatorFillMPoly,
    ),
);
