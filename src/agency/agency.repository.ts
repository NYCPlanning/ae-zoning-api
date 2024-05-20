import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindManyRepo } from "./agency.repository.schema";

export class AgencyRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.agency.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }
}
