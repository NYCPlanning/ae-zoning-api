import { Inject } from "@nestjs/common";
import { DataRetrievalException } from "src/exception";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  CheckByCodeRepo,
  FindManyRepo,
} from "./agency-budget.repository.schema";
import { agencyBudget } from "src/schema";

export class AgencyBudgetRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkByCode = this.db.query.agencyBudget
    .findFirst({
      columns: { code: true },
      where: (agencyBudget, { eq, sql }) =>
        eq(agencyBudget.code, sql.placeholder("code")),
    })
    .prepare("checkByCode");

  async checkByCode(code: string): Promise<CheckByCodeRepo | undefined> {
    try {
      return await this.#checkByCode.execute({ code });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.agencyBudget.findMany({
        orderBy: agencyBudget.code,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }
}
