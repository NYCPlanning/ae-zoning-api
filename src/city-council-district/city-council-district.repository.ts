import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindManyRepo } from "./city-council-district.repository.schema";

export class CityCouncilDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.cityCouncilDistrict.findMany({
        columns: {
          id: true,
        },
      });
    } catch {
      throw new DataRetrievalException();
    }
  }
}
