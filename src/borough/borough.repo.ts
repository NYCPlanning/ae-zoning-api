import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/error";

export class BoroughRepo {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findAll() {
    try {
      return await this.db.query.borough.findMany();
    } catch {
      throw DataRetrievalException;
    }
  }
}
