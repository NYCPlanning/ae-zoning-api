import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindCommunityDistrictsByBoroughIdRepo,
  FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepo,
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdRepo,
} from "./borough.repository.schema";
import {
  capitalCommitment,
  capitalCommitmentFund,
  capitalProject,
  communityDistrict,
} from "src/schema";
import { eq, sql, and, isNotNull, asc } from "drizzle-orm";
import {
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
  FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams,
} from "src/gen";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class BoroughRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkById = this.db.query.borough
    .findFirst({
      columns: {
        id: true,
      },
      where: (borough, { eq, sql }) => eq(borough.id, sql.placeholder("id")),
    })
    .prepare("checkById");

  async checkById(id: string): Promise<CheckByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "borough",
      function: "checkById",
    });

    const cachedValue: boolean | null = await this.cacheManager.get(key);
    if (cachedValue !== null) return cachedValue;

    try {
      const result = await this.#checkById.execute({
        id,
      });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.borough.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCommunityDistrictsByBoroughId(
    id: string,
  ): Promise<FindCommunityDistrictsByBoroughIdRepo> {
    try {
      return await this.db.query.communityDistrict.findMany({
        columns: {
          id: true,
          boroughId: true,
        },
        where: eq(communityDistrict.boroughId, id),
        orderBy: asc(communityDistrict.id),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
  }: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams): Promise<
    FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepo | undefined
  > {
    try {
      return await this.db.query.communityDistrict.findFirst({
        columns: {
          id: true,
          boroughId: true,
        },
        extras: {
          geometry:
            sql<string>`ST_AsGeoJSON(ST_Transform(${communityDistrict.liFt}, 4326), 6)`.as(
              "geometry",
            ),
        },
        where: (communityDistrict, { and, eq }) =>
          and(
            eq(communityDistrict.boroughId, boroughId),
            eq(communityDistrict.id, communityDistrictId),
          ),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCapitalProjectTilesByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
    z,
    x,
    y,
  }: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams): Promise<FindCapitalProjectTilesByBoroughIdCommunityDistrictIdRepo> {
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
          commitmentsTotal:
            sql`SUM(${capitalCommitmentFund.value})::double precision`
              .mapWith(Number)
              .as("commitmentsTotal"),
          agencyBudgets: sql<
            Array<string>
          >`ARRAY_TO_JSON(ARRAY_AGG(DISTINCT ${capitalCommitment.budgetLineCode}))`.as(
            "agencyBudgets",
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
        .leftJoin(
          communityDistrict,
          sql`
            ST_Intersects(${communityDistrict.mercatorFill}, ${capitalProject.mercatorFillMPoly})
            OR ST_Intersects(${communityDistrict.mercatorFill}, ${capitalProject.mercatorFillMPnt})`,
        )
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
        .where(
          and(
            eq(communityDistrict.id, communityDistrictId),
            eq(communityDistrict.boroughId, boroughId),
            eq(capitalCommitmentFund.category, "total"),
          ),
        )
        .groupBy(
          capitalProject.id,
          capitalProject.managingCode,
          capitalProject.managingAgency,
          capitalProject.mercatorFillMPnt,
          capitalProject.mercatorFillMPoly,
        )
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
