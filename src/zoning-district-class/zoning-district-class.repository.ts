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
      const result = await this.db.query.zoningDistrictClass.findMany({
        columns: {
          id: true,
          description: true,
          category: true,
          color: true,
          url: true,
        },
      });

      return result.map((zoningDistrictClass: any) => ({
        ...zoningDistrictClass,
        category: zoningDistrictClass.category as ZoningDistrictClassCategory,
      }));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findById(id: string): Promise<FindByIdRepo | undefined> {
    try {
      const result = await this.db.query.zoningDistrictClass.findFirst({
        where: eq(zoningDistrictClass.id, id),
      });

      if (!result) {
        return undefined;
      }

      const typedResult: FindByIdRepo = {
        id: result.id,
        description: result.description,
        category: result.category as ZoningDistrictClassCategory,
        color: result.color,
        url: result.url,
      };

      return typedResult;
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
