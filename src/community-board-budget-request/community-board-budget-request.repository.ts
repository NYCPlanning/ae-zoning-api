import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckNeedGroupByIdRepo,
  CheckPolicyAreaByIdRepo,
  FindNeedGroupsRepo,
  FindPolicyAreasRepo,
  FindAgenciesRepo,
  FindCommunityBoardBudgetRequestByIdRepo,
  FindTilesRepo,
} from "./community-board-budget-request.repository.schema";
import {
  agency,
  cbbrNeedGroup,
  cbbrPolicyArea,
  cbbrOptionCascade,
  communityBoardBudgetRequest,
  borough,
} from "src/schema";
import { eq, and, sql, isNotNull, or } from "drizzle-orm";
import {
  FindCommunityBoardBudgetRequestAgenciesQueryParams,
  FindCommunityBoardBudgetRequestByIdPathParams,
  FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
  FindCommunityBoardBudgetRequestTilesPathParams,
} from "src/gen";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  TILE_CACHE,
  TileCacheService,
} from "src/global/providers/tile-cache.provider";

export class CommunityBoardBudgetRequestRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(TILE_CACHE) private readonly tileCache: TileCacheService,
  ) { }

  #checkNeedGroupById = this.db.query.cbbrNeedGroup
    .findFirst({
      columns: {
        id: true,
      },
      where: (cbbrNeedGroup, { eq, sql }) =>
        eq(cbbrNeedGroup.id, sql.placeholder("id")),
    })
    .prepare("#checkNeedGroupById");

  async checkNeedGroupById(id: number): Promise<CheckNeedGroupByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "communityBoardBudgetRequest",
      function: "checkNeedGroupById",
    });
    const cachedValue: CheckNeedGroupByIdRepo | null =
      await this.cacheManager.get(key);
    if (cachedValue !== null) return cachedValue;
    try {
      const result = await this.#checkNeedGroupById.execute({ id });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot find community board budget request need group by its id",
      );
    }
  }

  #checkPolicyAreaById = this.db.query.cbbrPolicyArea
    .findFirst({
      columns: {
        id: true,
      },
      where: (cbbrPolicyArea, { eq, sql }) =>
        eq(cbbrPolicyArea.id, sql.placeholder("id")),
    })
    .prepare("#checkPolicyAreaById");

  async checkPolicyAreaById(id: number): Promise<CheckPolicyAreaByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "communityBoardBudgetRequest",
      function: "checkPolicyAreaById",
    });
    const cachedValue: CheckPolicyAreaByIdRepo | null =
      await this.cacheManager.get(key);
    if (cachedValue !== null) return cachedValue;
    try {
      const result = await this.#checkPolicyAreaById.execute({ id });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot find community board budget request policy area by its id",
      );
    }
  }

  async findAgencies({
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
  }: FindCommunityBoardBudgetRequestAgenciesQueryParams): Promise<FindAgenciesRepo> {
    try {
      return await this.db
        .selectDistinct({
          initials: agency.initials,
          name: agency.name,
        })
        .from(agency)
        .leftJoin(
          cbbrOptionCascade,
          eq(agency.initials, cbbrOptionCascade.agencyInitials),
        )
        .where(
          and(
            isNotNull(cbbrOptionCascade.agencyInitials),
            cbbrNeedGroupId !== undefined
              ? eq(cbbrOptionCascade.needGroupId, cbbrNeedGroupId)
              : undefined,
            cbbrPolicyAreaId !== undefined
              ? eq(cbbrOptionCascade.policyAreaId, cbbrPolicyAreaId)
              : undefined,
          ),
        )
        .orderBy(agency.name);
    } catch {
      throw new DataRetrievalException("cannot find agencies");
    }
  }

  async findNeedGroups({
    cbbrPolicyAreaId,
    agencyInitials,
  }: FindCommunityBoardBudgetRequestNeedGroupsQueryParams): Promise<FindNeedGroupsRepo> {
    try {
      return await this.db
        .selectDistinct({
          id: cbbrNeedGroup.id,
          description: cbbrNeedGroup.description,
        })
        .from(cbbrNeedGroup)
        .leftJoin(
          cbbrOptionCascade,
          and(
            sql`${cbbrPolicyAreaId !== undefined || agencyInitials !== undefined} IS TRUE`,
            eq(cbbrNeedGroup.id, cbbrOptionCascade.needGroupId),
          ),
        )
        .where(
          and(
            cbbrPolicyAreaId !== undefined
              ? eq(cbbrOptionCascade.policyAreaId, cbbrPolicyAreaId)
              : undefined,
            agencyInitials !== undefined
              ? eq(cbbrOptionCascade.agencyInitials, agencyInitials)
              : undefined,
          ),
        )
        .orderBy(cbbrNeedGroup.id);
    } catch {
      throw new DataRetrievalException("cannot find need groups");
    }
  }

  async findPolicyAreas({
    cbbrNeedGroupId,
    agencyInitials,
  }: FindCommunityBoardBudgetRequestPolicyAreasQueryParams): Promise<FindPolicyAreasRepo> {
    try {
      return await this.db
        .selectDistinct({
          id: cbbrPolicyArea.id,
          description: cbbrPolicyArea.description,
        })
        .from(cbbrPolicyArea)
        .leftJoin(
          cbbrOptionCascade,
          and(
            sql`${cbbrNeedGroupId !== undefined || agencyInitials !== undefined} IS TRUE`,
            eq(cbbrPolicyArea.id, cbbrOptionCascade.policyAreaId),
          ),
        )
        .where(
          and(
            cbbrNeedGroupId !== undefined
              ? eq(cbbrOptionCascade.needGroupId, cbbrNeedGroupId)
              : undefined,
            agencyInitials !== undefined
              ? eq(cbbrOptionCascade.agencyInitials, agencyInitials)
              : undefined,
          ),
        )
        .orderBy(cbbrPolicyArea.id);
    } catch {
      throw new DataRetrievalException("cannot find policy areas");
    }
  }

  async findById({
    cbbrId,
  }: FindCommunityBoardBudgetRequestByIdPathParams): Promise<FindCommunityBoardBudgetRequestByIdRepo> {
    try {
      return await this.db
        .select({
          id: communityBoardBudgetRequest.id,
          cbbrPolicyAreaId: communityBoardBudgetRequest.policyArea,
          title: communityBoardBudgetRequest.title,
          description: communityBoardBudgetRequest.explanation,
          communityBoardId: sql<string>`${borough.abbr} || ${communityBoardBudgetRequest.communityDistrictId}`,
          agencyInitials: communityBoardBudgetRequest.agency,
          priority: communityBoardBudgetRequest.priority,
          cbbrType: sql<
            "Capital" | "Expense"
          >`${communityBoardBudgetRequest.requestType}`,
          isMapped: communityBoardBudgetRequest.isLocationSpecific,
          isContinuedSupport: communityBoardBudgetRequest.isContinuedSupport,
          agencyCategoryResponse:
            communityBoardBudgetRequest.agencyCategoryResponse,
          agencyResponse: communityBoardBudgetRequest.agencyResponse,
        })
        .from(communityBoardBudgetRequest)
        .where(eq(communityBoardBudgetRequest.id, cbbrId))
        .leftJoin(
          borough,
          eq(borough.id, communityBoardBudgetRequest.boroughId),
        )
        .limit(1);
    } catch {
      throw new DataRetrievalException(
        "Cannot find Community Board Budget Request with given id",
      );
    }
  }

  async findTiles({
    z,
    x,
    y,
  }: FindCommunityBoardBudgetRequestTilesPathParams): Promise<FindTilesRepo> {
    const cacheKey = JSON.stringify({
      domain: "communityBoardBudgetRequest",
      function: "findTiles",
      z,
      x,
      y,
    });
    // const cachedTiles =
    //   await this.tileCache.get<Buffer<ArrayBufferLike>>(cacheKey);
    // if (cachedTiles !== null) return cachedTiles;
    try {
      const tileFill = this.db
        .select({
          id: sql`${communityBoardBudgetRequest.id}`.as("id"),
          policyAreaId: sql`${communityBoardBudgetRequest.policyArea}`.as(
            "policyAreaId",
          ),
          needGroupId: sql`${communityBoardBudgetRequest.needGroup}`.as(
            "needGroupId",
          ),
          agencyInitials: sql`${communityBoardBudgetRequest.agency}`.as(
            "agencyInitials",
          ),
          agencyCategoryReponseId:
            sql`${communityBoardBudgetRequest.agencyCategoryResponse}`.as(
              "agencyCategoryReponseId",
            ),
          communityBoardId:
            sql`${borough.abbr} || ${communityBoardBudgetRequest.communityDistrictId}`.as(
              "communityBoardId",
            ),
          geomFill: sql<string>`
              CASE
                WHEN ${communityBoardBudgetRequest.mercatorFillMPoly} && ST_TileEnvelope(${z},${x},${y})
                  THEN ST_AsMVTGeom(
                    ${communityBoardBudgetRequest.mercatorFillMPoly},
                    ST_TileEnvelope(${z},${x},${y}),
                    4096,
                    64,
                    true
                  )
                WHEN ${communityBoardBudgetRequest.mercatorFillMPnt} && ST_TileEnvelope(${z},${x},${y})
                  THEN ST_AsMVTGeom(
                    ${communityBoardBudgetRequest.mercatorFillMPnt},
                    ST_TileEnvelope(${z},${x},${y}),
                    4096,
                    64,
                    true
                  )
              END`.as("geomFill"),
        })
        .from(communityBoardBudgetRequest)
        .leftJoin(
          borough,
          eq(communityBoardBudgetRequest.boroughId, borough.id),
        )
        .where(
          // sql`${communityBoardBudgetRequest.mercatorFillMPoly} && ST_TileEnvelope(${z},${x},${y}) OR ${communityBoardBudgetRequest.mercatorFillMPnt} && ST_TileEnvelope(${z},${x},${y})`,
          or(
            isNotNull(communityBoardBudgetRequest.mercatorFillMPnt),
            isNotNull(communityBoardBudgetRequest.mercatorFillMPoly),
          ),
        )
        .as("tile");
      const dataFill = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'community-board-budget-request-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const tileLabel = this.db
        .select({
          id: sql`${communityBoardBudgetRequest.id}`.as("id"),
          policyAreaId: sql`${communityBoardBudgetRequest.policyArea}`.as(
            "policyAreaId",
          ),
          needGroupId: sql`${communityBoardBudgetRequest.needGroup}`.as(
            "needGroupId",
          ),
          agencyInitials: sql`${communityBoardBudgetRequest.agency}`.as(
            "agencyInitials",
          ),
          agencyCategoryReponseId:
            sql`${communityBoardBudgetRequest.agencyCategoryResponse}`.as(
              "agencyCategoryReponseId",
            ),
          communityBoardId:
            sql`${borough.abbr} || ${communityBoardBudgetRequest.communityDistrictId}`.as(
              "communityBoardId",
            ),
          geomLabel: sql`ST_AsMVTGeom(
      		  ${communityBoardBudgetRequest.mercatorLabel},
      		  ST_TileEnvelope(${z}, ${x}, ${y}),
      		  4096, 64, true)`.as("geomLabel"),
        })
        .from(communityBoardBudgetRequest)
        .leftJoin(
          borough,
          eq(communityBoardBudgetRequest.boroughId, borough.id),
        )
        .where(
          sql`${communityBoardBudgetRequest.mercatorLabel} && ST_TileEnvelope(${z},${x},${y})`,
        )
        .as("tile");
      const dataLabel = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'community-board-budget-request-label', 4096, 'geomLabel')`,
        })
        .from(tileLabel)
        .where(isNotNull(tileLabel.geomLabel));
      const [fill, label] = await Promise.all([dataFill, dataLabel]);
      const mvt = Buffer.concat([fill[0].mvt, label[0].mvt]);
      // this.tileCache.set(cacheKey, mvt);
      return mvt;
    } catch (e) {
      console.log(e);
      throw new DataRetrievalException(
        "cannot find community board budget request tiles",
      );
    }
  }
}
