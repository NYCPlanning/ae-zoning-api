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
} from "./community-board-budget-request.repository.schema";
import {
  agency,
  cbbrNeedGroup,
  cbbrPolicyArea,
  cbbrOptionCascade,
  communityBoardBudgetRequest,
  cbbrRequest,
} from "src/schema";
import { eq, and, sql, isNotNull } from "drizzle-orm";
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
          boroughId: communityBoardBudgetRequest.boroughId,
          communityDistrictId: communityBoardBudgetRequest.communityDistrictId,
          agencyInitials: communityBoardBudgetRequest.agency,
          priority: communityBoardBudgetRequest.priority,
          cbbrType: communityBoardBudgetRequest.requestType,
          isMapped: communityBoardBudgetRequest.isLocationSpecific,
          isContinuedSupport: communityBoardBudgetRequest.isContinuedSupport,
          agencyCategoryResponse:
            communityBoardBudgetRequest.agencyCategoryResponse,
          agencyResponse: communityBoardBudgetRequest.agencyResponse,
        })
        .from(communityBoardBudgetRequest)
        .where(eq(communityBoardBudgetRequest.id, cbbrId))
        .leftJoin(
          cbbrRequest,
          eq(communityBoardBudgetRequest.request, cbbrRequest.id),
        )
        .limit(1);
    } catch {
      throw new DataRetrievalException(
        "Cannot find Community Board Budget Request with given id",
      );
    }
  }
}
