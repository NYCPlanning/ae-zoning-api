import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { CheckByIdRepo, FindManyRepo } from "./agency.repository.schema";

export class AgencyRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkManagingAgency = this.db.query.agency
    .findFirst({
      columns: {
        initials: true,
      },
      where: (agency, { eq, sql }) =>
        eq(agency.initials, sql.placeholder("initials")),
    })
    .prepare("checkManagingAgency");

  async checkManagingAgency(
    initials: string,
  ): Promise<CheckByIdRepo | undefined> {
    try {
      return await this.#checkManagingAgency.execute({
        initials,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.agency.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }
}
