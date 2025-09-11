import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckNeedGroupByIdRepo,
  FindPolicyAreasRepo,
} from "./community-board-budget-request.repository.schema";
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
}
