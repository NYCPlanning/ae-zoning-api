import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import { zoningDistrictClass } from "src/schema";
import {
  FindAllRepo,
  findByIdRepo,
} from "./zoning-district-class.repository.schema";

export class ZoningDistrictClassRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findAll(): Promise<FindAllRepo | undefined> {
    try {
      return await this.db.query.zoningDistrictClass.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findById(id: string): Promise<findByIdRepo | undefined> {
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
