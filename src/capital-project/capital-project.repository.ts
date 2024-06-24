import { Inject } from "@nestjs/common";
import { isNotNull, sql, and, eq, sum } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectTilesPathParams,
} from "src/gen";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  agencyBudget,
  capitalCommitment,
  capitalCommitmentFund,
  capitalProject,
} from "src/schema";
import {
  FindByManagingCodeCapitalProjectIdRepo,
  FindTilesRepo,
} from "./capital-project.repository.schema";

export class CapitalProjectRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findByManagingCodeCapitalProjectId(
    params: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  ): Promise<FindByManagingCodeCapitalProjectIdRepo> {
    const { managingCode, capitalProjectId } = params;
    try {
      return await this.db
        .select({
          id: capitalProject.id,
          managingCode: capitalProject.managingCode,
          description: capitalProject.description,
          managingAgency: capitalProject.managingAgency,
          minDate: capitalProject.minDate,
          maxDate: capitalProject.maxDate,
          category: capitalProject.category,
          sponsoringAgencies: sql<
            Array<string>
          >`ARRAY_AGG(DISTINCT ${agencyBudget.sponsor})`,
          budgetTypes: sql<
            Array<string>
          >`ARRAY_AGG(DISTINCT ${agencyBudget.type})`,
          commitmentsTotal: sum(capitalCommitmentFund.value).mapWith(Number),
        })
        .from(capitalProject)
        .leftJoin(
          capitalCommitment,
          and(
            eq(capitalProject.managingCode, capitalCommitment.managingCode),
            eq(capitalProject.id, capitalCommitment.capitalProjectId),
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
        .where(
          and(
            eq(capitalProject.managingCode, managingCode),
            eq(capitalProject.id, capitalProjectId),
          ),
        )
        .groupBy(capitalProject.managingCode, capitalProject.id)
        .limit(1);
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findTiles(
    params: FindCapitalProjectTilesPathParams,
  ): Promise<FindTilesRepo> {
    const { z, x, y } = params;
    try {
      const tile = this.db
        .select({
          managingCodeCapitalProjectId:
            sql<string>`${capitalProject.managingCode} || ${capitalProject.id}`.as(
              `managingCodeCapitalProjectId`,
            ),
          managingAgency: sql`${capitalProject.managingAgency}`.as(
            `managingAgency`,
          ),
          geom: sql<string>`
            CASE 
              WHEN ${capitalProject.mercatorFillMPoly} && ST_TileEnvelope(${z},${x},${y})
                THEN ST_AsMVTGeom(
                  ${capitalProject.mercatorFillMPoly},
                  ST_TileEnvelope(${z},${x},${y}),
                  4096,
                  64,
                  true
                )
              WHEN ${capitalProject.mercatorFillMPnt} && ST_TileEnvelope(${z},${x},${y})
                THEN ST_AsMVTGeom(
                  ${capitalProject.mercatorFillMPnt},
                  ST_TileEnvelope(${z},${x},${y}),
                  4096,
                  64,
                  true
                )
            END`.as("geom"),
        })
        .from(capitalProject)
        .as("tile");
      const data = await this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'capital-project-fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
      return data[0].mvt;
    } catch {
      throw new DataRetrievalException();
    }
  }
}
