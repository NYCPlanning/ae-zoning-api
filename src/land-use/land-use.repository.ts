import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindAllRepo } from "./land-use.repository.schema";

export class LandUseRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findAll(): Promise<FindAllRepo> {
    try {
      return await this.db.query.landUse.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }
}
