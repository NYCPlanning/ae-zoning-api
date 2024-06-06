import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
// import { FindManyRepo } from "./city-council-district.repository.schema";

export class CommunityDistrictRepository {
    constructor(
        @Inject(DB)
        private readonly db: DbType,
      ) {}
}