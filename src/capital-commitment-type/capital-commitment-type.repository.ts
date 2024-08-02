import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindManyRepo } from "./capital-commitment-type.repository.schema";

export class CapitalCommitmentTypeRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.capitalCommitmentType.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }
}
