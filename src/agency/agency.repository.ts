import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { CheckByInitialsRepo, FindManyRepo } from "./agency.repository.schema";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class AgencyRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkByInitials = this.db.query.agency
    .findFirst({
      columns: {
        initials: true,
      },
      where: (agency, { eq, sql }) =>
        eq(agency.initials, sql.placeholder("initials")),
    })
    .prepare("checkByInitials");

  async checkByInitials(initials: string): Promise<CheckByInitialsRepo> {
    const key = JSON.stringify({
      initials,
      domain: "agency",
      function: "checkByInitials",
    });
    const cacheStart = performance.now();
    const cachedValue: boolean | null = await this.cacheManager.get(key);
    console.log("cache", cachedValue);
    console.log("cache time", performance.now() - cacheStart);
    if (cachedValue !== null) return cachedValue;
    try {
      const dbStart = performance.now();
      const result = await this.#checkByInitials.execute({
        initials,
      });
      console.log("db time", performance.now() - dbStart);
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.agency.findMany({
        orderBy: (agency, { asc }) => [asc(agency.initials)],
      });
    } catch {
      throw new DataRetrievalException();
    }
  }
}
