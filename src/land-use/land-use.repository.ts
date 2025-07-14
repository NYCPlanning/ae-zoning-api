import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindManyRepo } from "./land-use.repository.schema";

export class LandUseRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.landUse.findMany();
    } catch {
      throw new DataRetrievalException("cannot find land uses");
    }
  }
}
