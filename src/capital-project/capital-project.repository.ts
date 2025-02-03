import { Inject } from "@nestjs/common";
import { isNotNull, sql, and, eq, sum, asc } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  CapitalProjectCategory,
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectTilesPathParams,
} from "src/gen";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  agencyBudget,
  budgetLine,
  capitalCommitment,
  capitalCommitmentFund,
  capitalProject,
  cityCouncilDistrict,
  communityDistrict,
} from "src/schema";
import {
  CheckByManagingCodeCapitalProjectIdRepo,
  FindByManagingCodeCapitalProjectIdRepo,
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo,
  FindGeoJsonByManagingCodeCapitalProjectIdRepo,
  FindManyRepo,
  FindTilesRepo,
} from "./capital-project.repository.schema";

export class CapitalProjectRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findMany({
    cityCouncilDistrictId,
    communityDistrictId,
    boroughId,
    limit,
    offset,
  }: {
    cityCouncilDistrictId: string | null;
    communityDistrictId: string | null;
    boroughId: string | null;
    limit: number;
    offset: number;
  }): Promise<FindManyRepo> {
    try {
      return await this.db
        .select({
          id: capitalProject.id,
          description: capitalProject.description,
          managingCode: capitalProject.managingCode,
          managingAgency: capitalProject.managingAgency,
          maxDate: capitalProject.maxDate,
          minDate: capitalProject.minDate,
          category: sql<CapitalProjectCategory>`${capitalProject.category}`,
        })
        .from(capitalProject)
        .leftJoin(
          cityCouncilDistrict,
          sql`
            ST_Intersects(${cityCouncilDistrict.liFt}, ${capitalProject.liFtMPoly})
            OR ST_Intersects(${cityCouncilDistrict.liFt}, ${capitalProject.liFtMPnt})`,
        )
        .leftJoin(
          communityDistrict,
          sql`
          ST_Intersects(${communityDistrict.liFt}, ${capitalProject.liFtMPoly})
          OR ST_Intersects(${communityDistrict.liFt}, ${capitalProject.liFtMPnt})`,
        )
        .where(
          and(
            cityCouncilDistrictId !== null
              ? eq(cityCouncilDistrict.id, cityCouncilDistrictId)
              : undefined,
            communityDistrictId !== null && boroughId !== null
              ? and(
                  eq(communityDistrict.boroughId, boroughId),
                  eq(communityDistrict.id, communityDistrictId),
                )
              : undefined,
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(capitalProject.managingCode, capitalProject.id);
    } catch {
      throw new DataRetrievalException();
    }
  }

  #checkByManagingCodeCapitalProjectId = this.db.query.capitalProject
    .findFirst({
      columns: {
        managingCode: true,
        id: true,
      },
      where: (capitalProject, { and, eq, sql }) =>
        and(
          eq(capitalProject.managingCode, sql.placeholder("managingCode")),
          eq(capitalProject.id, sql.placeholder("capitalProjectId")),
        ),
    })
    .prepare("checkByManagingCodeCapitalProjectId");

  async checkByManagingCodeCapitalProjectId(
    managingCode: string,
    capitalProjectId: string,
  ): Promise<CheckByManagingCodeCapitalProjectIdRepo | undefined> {
    return await this.#checkByManagingCodeCapitalProjectId.execute({
      managingCode,
      capitalProjectId,
    });
  }

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
          category: sql<CapitalProjectCategory>`${capitalProject.category}`,
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
            eq(capitalCommitmentFund.category, "total"),
          ),
        )
        .groupBy(capitalProject.managingCode, capitalProject.id)
        .limit(1);
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findGeoJsonByManagingCodeCapitalProjectId(
    params: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  ): Promise<FindGeoJsonByManagingCodeCapitalProjectIdRepo> {
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
          category: sql<CapitalProjectCategory>`${capitalProject.category}`,
          sponsoringAgencies: sql<
            Array<string>
          >`ARRAY_AGG(DISTINCT ${agencyBudget.sponsor})`,
          budgetTypes: sql<
            Array<string>
          >`ARRAY_AGG(DISTINCT ${agencyBudget.type})`,
          commitmentsTotal: sum(capitalCommitmentFund.value).mapWith(Number),
          geometry: sql<string | null>`
            CASE
            WHEN
              ${capitalProject.liFtMPoly} IS NOT null
            THEN
              ST_asGeoJSON(ST_Transform(${capitalProject.liFtMPoly}, 4326),6)
            ELSE
              ST_asGeoJSON(ST_Transform(${capitalProject.liFtMPnt}, 4326),6)
            END
          `.as("geometry"),
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
            eq(capitalCommitmentFund.category, "total"),
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

  async findCapitalCommitmentsByManagingCodeCapitalProjectId(
    params: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  ): Promise<FindCapitalCommitmentsByManagingCodeCapitalProjectIdRepo> {
    const { managingCode, capitalProjectId } = params;
    try {
      return await this.db
        .select({
          id: capitalCommitment.id,
          type: capitalCommitment.type,
          plannedDate: capitalCommitment.plannedDate,
          budgetLineCode: capitalCommitment.budgetLineCode,
          budgetLineId: capitalCommitment.budgetLineId,
          sponsoringAgency: sql<string>`${agencyBudget.sponsor}`,
          budgetType: sql<string>`${agencyBudget.type}`,
          totalValue: sql`${capitalCommitmentFund.value}`.mapWith(Number),
        })
        .from(capitalCommitment)
        .orderBy(asc(capitalCommitment.plannedDate))
        .leftJoin(
          budgetLine,
          and(
            eq(budgetLine.id, capitalCommitment.budgetLineId),
            eq(budgetLine.code, capitalCommitment.budgetLineCode),
          ),
        )
        .leftJoin(agencyBudget, eq(agencyBudget.code, budgetLine.code))
        .leftJoin(
          capitalCommitmentFund,
          eq(capitalCommitmentFund.capitalCommitmentId, capitalCommitment.id),
        )
        .where(
          and(
            eq(capitalCommitmentFund.category, "total"),
            eq(capitalCommitment.managingCode, managingCode),
            eq(capitalCommitment.capitalProjectId, capitalProjectId),
          ),
        );
    } catch {
      throw new DataRetrievalException();
    }
  }
}
