import { Inject } from "@nestjs/common";
import { DataRetrievalException } from "src/exception";
import { DB, DbType } from "src/global/providers/db.provider";
import { FindManyRepo } from "./agency-budget.repository.schema";
import { agencyBudget } from "src/schema";

export class AgencyBudgetRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

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
