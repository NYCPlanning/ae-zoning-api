import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { CheckByInitialsRepo, FindManyRepo } from "./agency.repository.schema";

export class AgencyRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
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

  async checkByInitials(
    initials: string,
  ): Promise<CheckByInitialsRepo | undefined> {
    try {
      return await this.#checkByInitials.execute({
        initials,
      });
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
