import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckNeedGroupByIdRepo,
  CheckPolicyAreaByIdRepo,
  CheckAgencyCategoryResponseByIdRepo,
  FindNeedGroupsRepo,
  FindPolicyAreasRepo,
  FindAgenciesRepo,
  FindTilesRepo,
  FindManyRepo,
  FindCsvRepo,
  FindCountRepo,
  FindByIdRepo,
  FindGeoJsonByIdRepo,
  CommunityBoardBudgetRequestGeometry,
} from "./community-board-budget-request.repository.schema";
import {
  agency,
  cbbrNeedGroup,
  cbbrPolicyArea,
  cbbrOptionCascade,
  cityCouncilDistrict,
  communityBoardBudgetRequest,
  borough,
  cbbrAgencyCategoryResponse,
  CbbrRequestTypeEntity,
  cbbrRequest,
} from "src/schema";
import { eq, and, or, sql, isNotNull, inArray } from "drizzle-orm";
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
  ) {}

  #checkAgencyCategoryResponseById = this.db.query.cbbrAgencyCategoryResponse
    .findFirst({
      columns: {
        id: true,
      },
      where: (cbbrAgencyCategoryResponse, { eq, sql }) =>
        eq(cbbrAgencyCategoryResponse.id, sql.placeholder("id")),
    })
    .prepare("#checkAgencyCategoryResponseById");

  async checkAgencyCategoryResponseById(
    id: number,
  ): Promise<CheckAgencyCategoryResponseByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "communityBoardBudgetRequest",
      function: "checkAgencyCategoryResponseById",
    });
    const cachedValue =
      await this.cacheManager.get<CheckAgencyCategoryResponseByIdRepo>(key);
    if (cachedValue !== undefined) return cachedValue;
    try {
      const result = await this.#checkAgencyCategoryResponseById.execute({
        id,
      });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot find community board budget request agency response category by its id",
      );
    }
  }

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
    const cachedValue =
      await this.cacheManager.get<CheckNeedGroupByIdRepo>(key);
    if (cachedValue !== undefined) return cachedValue;
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
    const cachedValue =
      await this.cacheManager.get<CheckPolicyAreaByIdRepo>(key);
    if (cachedValue !== undefined) return cachedValue;
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
  }: FindCommunityBoardBudgetRequestByIdPathParams): Promise<FindByIdRepo> {
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
          cbbrType: sql<CbbrRequestTypeEntity>`${communityBoardBudgetRequest.requestType}`,
          isMapped: communityBoardBudgetRequest.isLocationSpecific,
          isContinuedSupport: communityBoardBudgetRequest.isContinuedSupport,
          cbbrAgencyCategoryResponseId:
            communityBoardBudgetRequest.agencyCategoryResponse,
          cbbrAgencyResponse: communityBoardBudgetRequest.agencyResponse,
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

  async findMany({
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
    agencyInitials,
    cbbrType,
    cbbrAgencyCategoryResponseIds,
    isMapped,
    isContinuedSupport,
    limit,
    offset,
  }: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: "Capital" | "Expense" | null;
    cbbrAgencyCategoryResponseIds: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
    limit: number;
    offset: number;
  }): Promise<FindManyRepo> {
    try {
      return await this.db
        .select({
          id: communityBoardBudgetRequest.id,
          cbbrPolicyAreaId: communityBoardBudgetRequest.policyArea,
          title: communityBoardBudgetRequest.title,
          communityBoardId: sql<string>`${borough.abbr} || ${communityBoardBudgetRequest.communityDistrictId}`,
          isMapped: sql<boolean>`${or(
            isNotNull(communityBoardBudgetRequest.liFtMPnt),
            isNotNull(communityBoardBudgetRequest.liFtMPoly),
          )}`,
          isContinuedSupport: communityBoardBudgetRequest.isContinuedSupport,
        })
        .from(communityBoardBudgetRequest)
        .leftJoin(
          borough,
          eq(borough.id, communityBoardBudgetRequest.boroughId),
        )
        .leftJoin(
          cityCouncilDistrict,
          and(
            sql`${cityCouncilDistrictId !== null} IS TRUE`,
            or(
              sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${communityBoardBudgetRequest.liFtMPoly})`,
              sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${communityBoardBudgetRequest.liFtMPnt})`,
            ),
          ),
        )
        .where(
          and(
            cityCouncilDistrictId !== null
              ? eq(cityCouncilDistrict.id, cityCouncilDistrictId)
              : undefined,
            boroughId !== null && communityDistrictId !== null
              ? and(
                  eq(communityBoardBudgetRequest.boroughId, boroughId),
                  eq(
                    communityBoardBudgetRequest.communityDistrictId,
                    communityDistrictId,
                  ),
                )
              : undefined,
            cbbrPolicyAreaId !== null
              ? eq(communityBoardBudgetRequest.policyArea, cbbrPolicyAreaId)
              : undefined,
            cbbrNeedGroupId !== null
              ? eq(communityBoardBudgetRequest.needGroup, cbbrNeedGroupId)
              : undefined,
            agencyInitials !== null
              ? eq(communityBoardBudgetRequest.agency, agencyInitials)
              : undefined,
            cbbrType !== null
              ? eq(communityBoardBudgetRequest.requestType, cbbrType)
              : undefined,
            cbbrAgencyCategoryResponseIds !== null
              ? inArray(
                  communityBoardBudgetRequest.agencyCategoryResponse,
                  cbbrAgencyCategoryResponseIds,
                )
              : undefined,
            isMapped !== null
              ? eq(
                  sql<boolean>`${or(
                    isNotNull(communityBoardBudgetRequest.liFtMPnt),
                    isNotNull(communityBoardBudgetRequest.liFtMPoly),
                  )}`,
                  isMapped,
                )
              : undefined,
            isContinuedSupport !== null
              ? eq(
                  communityBoardBudgetRequest.isContinuedSupport,
                  isContinuedSupport,
                )
              : undefined,
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(communityBoardBudgetRequest.id);
    } catch {
      throw new DataRetrievalException(
        "Cannot find Community Board Budget Requests",
      );
    }
  }

  async findCount({
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
    agencyInitials,
    cbbrType,
    cbbrAgencyCategoryResponseIds,
    isMapped,
    isContinuedSupport,
  }: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: "Capital" | "Expense" | null;
    cbbrAgencyCategoryResponseIds: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
  }): Promise<FindCountRepo> {
    const key = JSON.stringify({
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrType,
      cbbrAgencyCategoryResponseIds,
      isMapped,
      isContinuedSupport,
      domain: "capitalProject",
      function: "findCount",
    });
    try {
      const results = await this.db
        .select({
          total:
            sql`COUNT(DISTINCT(${communityBoardBudgetRequest.id}))`.mapWith(
              Number,
            ),
        })
        .from(communityBoardBudgetRequest)
        .leftJoin(
          borough,
          eq(borough.id, communityBoardBudgetRequest.boroughId),
        )
        .leftJoin(
          cityCouncilDistrict,
          and(
            sql`${cityCouncilDistrictId !== null} IS TRUE`,
            or(
              sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${communityBoardBudgetRequest.liFtMPoly})`,
              sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${communityBoardBudgetRequest.liFtMPnt})`,
            ),
          ),
        )
        .where(
          and(
            cityCouncilDistrictId !== null
              ? eq(cityCouncilDistrict.id, cityCouncilDistrictId)
              : undefined,
            boroughId !== null && communityDistrictId !== null
              ? and(
                  eq(communityBoardBudgetRequest.boroughId, boroughId),
                  eq(
                    communityBoardBudgetRequest.communityDistrictId,
                    communityDistrictId,
                  ),
                )
              : undefined,
            cbbrPolicyAreaId !== null
              ? eq(communityBoardBudgetRequest.policyArea, cbbrPolicyAreaId)
              : undefined,
            cbbrNeedGroupId !== null
              ? eq(communityBoardBudgetRequest.needGroup, cbbrNeedGroupId)
              : undefined,
            agencyInitials !== null
              ? eq(communityBoardBudgetRequest.agency, agencyInitials)
              : undefined,
            cbbrType !== null
              ? eq(communityBoardBudgetRequest.requestType, cbbrType)
              : undefined,
            cbbrAgencyCategoryResponseIds !== null
              ? inArray(
                  communityBoardBudgetRequest.agencyCategoryResponse,
                  cbbrAgencyCategoryResponseIds,
                )
              : undefined,
            isMapped !== null
              ? eq(
                  sql<boolean>`${or(
                    isNotNull(communityBoardBudgetRequest.liFtMPnt),
                    isNotNull(communityBoardBudgetRequest.liFtMPoly),
                  )}`,
                  isMapped,
                )
              : undefined,
            isContinuedSupport !== null
              ? eq(
                  communityBoardBudgetRequest.isContinuedSupport,
                  isContinuedSupport,
                )
              : undefined,
          ),
        );
      const { total } = results[0];
      this.cacheManager.set(key, total);
      return total;
    } catch {
      throw new DataRetrievalException(
        "Cannot find Community Board Budget Requests count",
      );
    }
  }

  async findAgencyCategoryResponses() {
    try {
      return await this.db
        .select({
          id: cbbrAgencyCategoryResponse.id,
          description: cbbrAgencyCategoryResponse.description,
        })
        .from(cbbrAgencyCategoryResponse)
        .orderBy(cbbrAgencyCategoryResponse.id);
    } catch {
      throw new DataRetrievalException(
        "cannot find agency response categories",
      );
    }
  }

  async findCsv({
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
    agencyInitials,
    cbbrType,
    cbbrAgencyCategoryResponseIds,
    isMapped,
    isContinuedSupport,
  }: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: "Capital" | "Expense" | null;
    cbbrAgencyCategoryResponseIds: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
  }): Promise<FindCsvRepo> {
    try {
      return await this.db
        .select({
          id: communityBoardBudgetRequest.id,
          communityBoardId: sql<string>`${borough.abbr} || ${communityBoardBudgetRequest.communityDistrictId}`,
          address: communityBoardBudgetRequest.address,
          siteName: communityBoardBudgetRequest.siteName,
          segmentOnStreet: communityBoardBudgetRequest.segmentOnStreet,
          segmentCrossStreetOne:
            communityBoardBudgetRequest.segmentCrossStreetOne,
          segmentCrossStreetTwo:
            communityBoardBudgetRequest.segmentCrossStreetTwo,
          intersectionStreetOne:
            communityBoardBudgetRequest.intersectionStreetOne,
          intersectionStreetTwo:
            communityBoardBudgetRequest.intersectionStreetTwo,
          requestType: sql<string>`SUBSTRING(${communityBoardBudgetRequest.requestType}, 1, 1)`,
          isContinuedSupport: communityBoardBudgetRequest.isContinuedSupport,
          request: cbbrRequest.description,
          explanation: communityBoardBudgetRequest.explanation,
          agency: communityBoardBudgetRequest.agency,
          priority: communityBoardBudgetRequest.priority,
          agencyCategoryResponse: cbbrAgencyCategoryResponse.description,
          agencyResponse: communityBoardBudgetRequest.agencyResponse,
        })
        .from(communityBoardBudgetRequest)
        .leftJoin(
          borough,
          eq(borough.id, communityBoardBudgetRequest.boroughId),
        )
        .leftJoin(
          cityCouncilDistrict,
          and(
            sql`${cityCouncilDistrictId !== null} IS TRUE`,
            or(
              sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${communityBoardBudgetRequest.liFtMPoly})`,
              sql`ST_Intersects(${cityCouncilDistrict.liFt}, ${communityBoardBudgetRequest.liFtMPnt})`,
            ),
          ),
        )
        .leftJoin(
          cbbrRequest,
          eq(cbbrRequest.id, communityBoardBudgetRequest.request),
        )
        .leftJoin(
          cbbrAgencyCategoryResponse,
          eq(
            cbbrAgencyCategoryResponse.id,
            communityBoardBudgetRequest.agencyCategoryResponse,
          ),
        )
        .where(
          and(
            cityCouncilDistrictId !== null
              ? eq(cityCouncilDistrict.id, cityCouncilDistrictId)
              : undefined,
            boroughId !== null && communityDistrictId !== null
              ? and(
                  eq(communityBoardBudgetRequest.boroughId, boroughId),
                  eq(
                    communityBoardBudgetRequest.communityDistrictId,
                    communityDistrictId,
                  ),
                )
              : undefined,
            cbbrPolicyAreaId !== null
              ? eq(communityBoardBudgetRequest.policyArea, cbbrPolicyAreaId)
              : undefined,
            cbbrNeedGroupId !== null
              ? eq(communityBoardBudgetRequest.needGroup, cbbrNeedGroupId)
              : undefined,
            agencyInitials !== null
              ? eq(communityBoardBudgetRequest.agency, agencyInitials)
              : undefined,
            cbbrType !== null
              ? eq(communityBoardBudgetRequest.requestType, cbbrType)
              : undefined,
            cbbrAgencyCategoryResponseIds !== null
              ? inArray(
                  communityBoardBudgetRequest.agencyCategoryResponse,
                  cbbrAgencyCategoryResponseIds,
                )
              : undefined,
            isMapped !== null
              ? eq(
                  sql<boolean>`${or(
                    isNotNull(communityBoardBudgetRequest.liFtMPnt),
                    isNotNull(communityBoardBudgetRequest.liFtMPoly),
                  )}`,
                  isMapped,
                )
              : undefined,
            isContinuedSupport !== null
              ? eq(
                  communityBoardBudgetRequest.isContinuedSupport,
                  isContinuedSupport,
                )
              : undefined,
          ),
        )
        .orderBy(communityBoardBudgetRequest.id);
    } catch {
      throw new DataRetrievalException(
        "Cannot find Community Board Budget Requests",
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
    const cachedTiles =
      await this.tileCache.get<Buffer<ArrayBufferLike>>(cacheKey);
    if (cachedTiles !== undefined) return cachedTiles;
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
          requestType: sql`${communityBoardBudgetRequest.requestType}`.as(
            "requestType",
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
          or(
            sql`${communityBoardBudgetRequest.mercatorFillMPnt} && ST_TileEnvelope(${z},${x},${y})`,
            sql`${communityBoardBudgetRequest.mercatorFillMPoly} && ST_TileEnvelope(${z},${x},${y})`,
          ),
        )
        .as("tile");
      const dataFill = await this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'community-board-budget-request-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const mvt = dataFill[0].mvt;
      this.tileCache.set(cacheKey, mvt);
      return mvt;
    } catch {
      throw new DataRetrievalException(
        "cannot find community board budget request tiles",
      );
    }
  }

  async findGeoJsonById({
    cbbrId,
  }: FindCommunityBoardBudgetRequestByIdPathParams): Promise<FindGeoJsonByIdRepo> {
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
          cbbrType: sql<CbbrRequestTypeEntity>`${communityBoardBudgetRequest.requestType}`,
          isMapped: sql<boolean>`${or(
            isNotNull(communityBoardBudgetRequest.liFtMPnt),
            isNotNull(communityBoardBudgetRequest.liFtMPoly),
          )}`,
          isContinuedSupport: communityBoardBudgetRequest.isContinuedSupport,
          cbbrAgencyCategoryResponseId:
            communityBoardBudgetRequest.agencyCategoryResponse,
          cbbrAgencyResponse: communityBoardBudgetRequest.agencyResponse,
          geometry: sql<CommunityBoardBudgetRequestGeometry>`
             CASE
             WHEN
               ${communityBoardBudgetRequest.liFtMPoly} IS NOT null
             THEN
               ST_asGeoJSON(ST_Transform(${communityBoardBudgetRequest.liFtMPoly}, 4326),6)
             ELSE
               ST_asGeoJSON(ST_Transform(${communityBoardBudgetRequest.liFtMPnt}, 4326),6)
             END
           `.as("geometry"),
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
        "Cannot find Community Board Budget Request GeoJson with given id",
      );
    }
  }
}
