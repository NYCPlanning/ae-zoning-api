import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckNeedGroupByIdRepo,
  CheckPolicyAreaByIdRepo,
  CheckAgencyResponseTypeByIdRepo,
  FindNeedGroupsRepo,
  FindPolicyAreasRepo,
  FindAgenciesRepo,
  FindCommunityBoardBudgetRequestByIdRepo,
  FindManyCommunityBoardBudgetRequestRepo,
  FindCountCommunityBoardBudgetRequestRepo,
} from "./community-board-budget-request.repository.schema";
import {
  agency,
  cbbrNeedGroup,
  cbbrPolicyArea,
  cbbrOptionCascade,
  cityCouncilDistrict,
  communityBoardBudgetRequest,
  borough,
} from "src/schema";
import { eq, and, or, sql, isNotNull, inArray } from "drizzle-orm";
import {
  FindCommunityBoardBudgetRequestAgenciesQueryParams,
  FindCommunityBoardBudgetRequestByIdPathParams,
  FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
} from "src/gen";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class CommunityBoardBudgetRequestRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkAgencyResponseTypeById = this.db.query.cbbrAgencyCategoryResponse
    .findFirst({
      columns: {
        id: true,
      },
      where: (cbbrAgencyCategoryResponse, { eq, sql }) =>
        eq(cbbrAgencyCategoryResponse.id, sql.placeholder("id")),
    })
    .prepare("#checkAgencyResponseTypeById");

  async checkAgencyResponseTypeById(
    id: number,
  ): Promise<CheckAgencyResponseTypeByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "communityBoardBudgetRequest",
      function: "checkAgencyResponseTypeById",
    });
    const cachedValue: CheckAgencyResponseTypeByIdRepo | null =
      await this.cacheManager.get(key);
    if (cachedValue !== null) return cachedValue;
    try {
      const result = await this.#checkAgencyResponseTypeById.execute({ id });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot find community board budget request agency response type by its id",
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

  async findMany({
    boroughId,
    communityDistrictId,
    cityCouncilDistrictId,
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
    agencyInitials,
    cbbrType,
    cbbrAgencyResponseTypeId,
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
    cbbrType: string | null;
    cbbrAgencyResponseTypeId: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
    limit: number;
    offset: number;
  }): Promise<FindManyCommunityBoardBudgetRequestRepo> {
    try {
      return await this.db
        .select({
          id: communityBoardBudgetRequest.id,
          cbbrPolicyAreaId: communityBoardBudgetRequest.policyArea,
          title: communityBoardBudgetRequest.title,
          communityBoardId: sql<string>`${borough.abbr} || ${communityBoardBudgetRequest.communityDistrictId}`,
          isMapped: communityBoardBudgetRequest.isLocationSpecific,
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
            boroughId !== null
              ? eq(communityBoardBudgetRequest.boroughId, boroughId)
              : undefined,
            communityDistrictId !== null
              ? eq(
                  sql<string>`${communityBoardBudgetRequest.boroughId} || ${communityBoardBudgetRequest.communityDistrictId}`,
                  communityDistrictId,
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
            cbbrType === "C"
              ? eq(communityBoardBudgetRequest.requestType, "Capital")
              : undefined,
            cbbrType === "E"
              ? eq(communityBoardBudgetRequest.requestType, "Expense")
              : undefined,
            cbbrAgencyResponseTypeId !== null
              ? inArray(
                  communityBoardBudgetRequest.agencyCategoryResponse,
                  cbbrAgencyResponseTypeId,
                )
              : undefined,
            isMapped !== null
              ? eq(communityBoardBudgetRequest.isLocationSpecific, isMapped)
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
    cbbrAgencyResponseTypeId,
    isMapped,
    isContinuedSupport,
  }: {
    boroughId: string | null;
    communityDistrictId: string | null;
    cityCouncilDistrictId: string | null;
    cbbrPolicyAreaId: number | null;
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
    cbbrType: string | null;
    cbbrAgencyResponseTypeId: Array<number> | null;
    isMapped: boolean | null;
    isContinuedSupport: boolean | null;
  }): Promise<FindCountCommunityBoardBudgetRequestRepo> {
    const key = JSON.stringify({
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrType,
      cbbrAgencyResponseTypeId,
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
            boroughId !== null
              ? eq(communityBoardBudgetRequest.boroughId, boroughId)
              : undefined,
            communityDistrictId !== null
              ? eq(
                  sql<string>`${communityBoardBudgetRequest.boroughId} || ${communityBoardBudgetRequest.communityDistrictId}`,
                  communityDistrictId,
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
            cbbrType === "C"
              ? eq(communityBoardBudgetRequest.requestType, "Capital")
              : undefined,
            cbbrType === "E"
              ? eq(communityBoardBudgetRequest.requestType, "Expense")
              : undefined,
            cbbrAgencyResponseTypeId !== null
              ? inArray(
                  communityBoardBudgetRequest.agencyCategoryResponse,
                  cbbrAgencyResponseTypeId,
                )
              : undefined,
            isMapped !== null
              ? eq(communityBoardBudgetRequest.isLocationSpecific, isMapped)
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
}
