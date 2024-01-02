import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";

export class ZoningDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkZoningDistrictById = this.db.query.zoningDistrict
    .findFirst({
      columns: {
        id: true,
      },
      where: (zoningDistrict, { eq, sql }) =>
        eq(zoningDistrict.id, sql.placeholder("id")),
    })
    .prepare("checkZoningDistrictById");

  async checkZoningDistrictById(id: string) {
    try {
      return await this.#checkZoningDistrictById.execute({
        id,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findByUuid(uuid: string) {
    try {
      return await this.db.query.zoningDistrict.findFirst({
        columns: { wgs84: false, liFt: false },
        where: eq(zoningDistrict.id, uuid),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findClassesByUuid(id: string) {
    try {
      return await this.db
        .select({
          id: zoningDistrictClass.id,
          category: zoningDistrictClass.category,
          description: zoningDistrictClass.description,
          url: zoningDistrictClass.url,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass)
        .leftJoin(
          zoningDistrictZoningDistrictClass,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictClassId,
            zoningDistrictClass.id,
          ),
        )
        .leftJoin(
          zoningDistrict,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictId,
            zoningDistrict.id,
          ),
        )
        .where(eq(zoningDistrict.id, id));
    } catch {
      throw new DataRetrievalException();
    }
  }
}
