import { Inject } from "@nestjs/common";
import { DataRetrievalException } from "src/exception";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  CheckByCodeRepo,
  FindManyRepo,
} from "./agency-budget.repository.schema";
import { agencyBudget } from "src/schema";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class AgencyBudgetRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkByCode = this.db.query.agencyBudget
    .findFirst({
      columns: { code: true },
      where: (agencyBudget, { eq, sql }) =>
        eq(agencyBudget.code, sql.placeholder("code")),
    })
    .prepare("checkByCode");

  async checkByCode(code: string): Promise<CheckByCodeRepo> {
    const key = JSON.stringify({
      code,
      domain: "agencyBudget",
      function: "checkByCode",
    });

    const cachedValue: boolean | null = await this.cacheManager.get(key);

    if (cachedValue !== null) return cachedValue;
    try {
      const result = await this.#checkByCode.execute({ code });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException("cannot find agency budget by code");
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.agencyBudget.findMany({
        orderBy: agencyBudget.code,
      });
    } catch {
      throw new DataRetrievalException("cannot find agency budgets");
    }
  }
}
