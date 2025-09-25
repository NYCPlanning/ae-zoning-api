import { sql, and, eq } from "drizzle-orm";
import { pgMaterializedView } from "drizzle-orm/pg-core";
import { capitalCommitment } from "./capital-commitment";
import { capitalCommitmentFund } from "./capital-commitment-fund";
import { capitalProject } from "./capital-project";

export const capitalProjectTile = pgMaterializedView("capital_project_tile").as(
  (qb) =>
    qb
      .select({
        managingCodeCapitalProjectId:
          sql<string>`${capitalProject.managingCode} || ${capitalProject.id}`.as(
            `managingCodeCapitalProjectId`,
          ),
        managingAgency: sql`${capitalProject.managingAgency}`.as(
          `managingAgency`,
        ),
        commitmentsTotal:
          // numeric type is econded as string, double precision type is encoded in mvt as number
          sql`SUM(${capitalCommitmentFund.value})::double precision`
            .mapWith(Number)
            .as("commitmentsTotal"),
        agencyBudgets: sql<
          Array<string>
        >`ARRAY_TO_JSON(ARRAY_AGG(DISTINCT ${capitalCommitment.budgetLineCode}))`.as(
          "agencyBudgets",
        ),
        mercatorFill: capitalProject.mercatorFill,
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
        capitalCommitmentFund,
        eq(capitalCommitmentFund.capitalCommitmentId, capitalCommitment.id),
      )
      .where(eq(capitalCommitmentFund.category, "total"))
      .groupBy(
        capitalProject.id,
        capitalProject.managingCode,
        capitalProject.managingAgency,
        capitalProject.mercatorFill,
        capitalProject.mercatorLabel,
      ),
);
