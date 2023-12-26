import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import { zoningDistrictClass } from "src/schema";

export class ZoningDistrictClassRepo {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findAll() {
    try {
      return await this.db.query.zoningDistrictClass.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findById(id: string) {
    try {
      return await this.db.query.zoningDistrictClass.findFirst({
        where: eq(zoningDistrictClass.id, id),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCategoryColors() {
    try {
      return await this.db
        .selectDistinctOn([zoningDistrictClass.category], {
          category: zoningDistrictClass.category,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass);
    } catch {
      throw new DataRetrievalException();
    }
  }
}
