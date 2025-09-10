import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { findPolicyAreasRepo } from "./community-board-budget-request.repository.schema";
import { cbbrPolicyArea, cbbrOptionCascade } from "src/schema";
import { eq, and, sql } from "drizzle-orm";
import { FindCommunityBoardBudgetRequestPolicyAreasQueryParams } from "src/gen";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class CommunityBoardBudgetRequestRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findPolicyAreas({
    cbbrNeedGroupId,
    agencyInitials,
  }: FindCommunityBoardBudgetRequestPolicyAreasQueryParams): Promise<findPolicyAreasRepo> {
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
        );
    } catch {
      throw new DataRetrievalException("cannot find policy areas");
    }
  }
}
