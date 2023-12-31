import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";

export class BoroughRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findAll() {
    try {
      return await this.db.query.borough.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }
}
