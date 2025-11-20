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
    const cachedValue = await this.cacheManager.get<boolean>(key);
    if (cachedValue !== undefined) return cachedValue;
    try {
      const result = await this.#checkByInitials.execute({
        initials,
      });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException("cannot find agency by initials");
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.agency.findMany({
        orderBy: (agency, { asc }) => [asc(agency.initials)],
      });
    } catch {
      throw new DataRetrievalException("cannot find agencies");
    }
  }
}
