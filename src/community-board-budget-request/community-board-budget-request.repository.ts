import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindManyCbbrPolicyAreaRepo } from "./community-board-budget-request.repository.schema";
import { cbbrPolicyArea, cbbrOptionCascade } from "src/schema";
import { eq, and, inArray } from "drizzle-orm";
import { FindCommunityBoardBudgetRequestPolicyAreasQueryParams } from "src/gen";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class CommunityBoardBudgetRequestRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findManyCbbrPolicyArea({
    cbbrNeedGroupId,
    agencyInitials,
  }: FindCommunityBoardBudgetRequestPolicyAreasQueryParams): Promise<FindManyCbbrPolicyAreaRepo> {
    try {
      if (cbbrNeedGroupId === undefined && agencyInitials === undefined) {
        return await this.db.query.cbbrPolicyArea.findMany();
      }
      const policyAreaIds = this.db
        .selectDistinct({ id: cbbrOptionCascade.policyAreaId })
        .from(cbbrOptionCascade)
        .where(
          and(
            cbbrNeedGroupId
              ? eq(cbbrOptionCascade.needGroupId, cbbrNeedGroupId)
              : undefined,
            agencyInitials
              ? eq(cbbrOptionCascade.agencyInitials, agencyInitials)
              : undefined,
          ),
        );

      return await this.db
        .select({
          id: cbbrPolicyArea.id,
          description: cbbrPolicyArea.description,
        })
        .from(cbbrPolicyArea)
        .where(inArray(cbbrPolicyArea.id, policyAreaIds));
    } catch {
      throw new DataRetrievalException("cannot find policy areas");
    }
  }
}
