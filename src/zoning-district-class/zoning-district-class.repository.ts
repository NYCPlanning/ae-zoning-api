import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import { zoningDistrictClass } from "src/schema";
import { ZoningDistrictClassCategory } from "src/gen";
import {
  FindManyRepo,
  FindByIdRepo,
  FindCategoryColorsRepo,
} from "./zoning-district-class.repository.schema";

export class ZoningDistrictClassRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db
        .select({
          id: zoningDistrictClass.id,
          description: zoningDistrictClass.description,
          category: sql<ZoningDistrictClassCategory>`${zoningDistrictClass.category}`,
          color: zoningDistrictClass.color,
          url: zoningDistrictClass.url,
        })
        .from(zoningDistrictClass);
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findById(id: string): Promise<FindByIdRepo | undefined> {
    try {
      const result = await this.db
        .select({
          id: zoningDistrictClass.id,
          category: sql<ZoningDistrictClassCategory>`${zoningDistrictClass.category}`,
          description: zoningDistrictClass.description,
          color: zoningDistrictClass.color,
          url: zoningDistrictClass.url,
        })
        .from(zoningDistrictClass)
        .where(eq(zoningDistrictClass.id, id))
        .limit(1);
      return result.length > 0 ? result[0] : undefined;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCategoryColors(): Promise<FindCategoryColorsRepo> {
    try {
      return await this.db
        .selectDistinctOn([zoningDistrictClass.category], {
          category: sql<ZoningDistrictClassCategory>`${zoningDistrictClass.category}`,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass);
    } catch {
      throw new DataRetrievalException();
    }
  }
}
