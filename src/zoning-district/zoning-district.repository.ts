import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { StorageConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { eq, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import { ZoningDistrictClassCategory } from "src/gen";
import {
  CheckByIdRepo,
  FindByIdRepo,
  FindZoningDistrictClassesByIdRepo,
} from "./zoning-district.repository.schema";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class ZoningDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkById = this.db.query.zoningDistrict
    .findFirst({
      columns: {
        id: true,
      },
      where: (zoningDistrict, { eq, sql }) =>
        eq(zoningDistrict.id, sql.placeholder("id")),
    })
    .prepare("checkZoningDistrictById");

  async checkById(id: string): Promise<CheckByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "zoningDistrict",
      function: "checkZoningDistrictById",
    });

    const cachedValue: boolean | null = await this.cacheManager.get(key);
    if (cachedValue !== null) return cachedValue;

    try {
      const result = await this.#checkById.execute({
        id,
      });

      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException("cannot find zoning district");
    }
  }

  async findById(id: string): Promise<FindByIdRepo | undefined> {
    try {
      return await this.db.query.zoningDistrict.findFirst({
        columns: { wgs84: false, liFt: false },
        where: eq(zoningDistrict.id, id),
      });
    } catch {
      throw new DataRetrievalException(
        "cannot find zoning district given an id",
      );
    }
  }

  async findZoningDistrictClassesById(
    id: string,
  ): Promise<FindZoningDistrictClassesByIdRepo> {
    try {
      return await this.db
        .select({
          id: zoningDistrictClass.id,
          category: sql<ZoningDistrictClassCategory>`${zoningDistrictClass.category}`,
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
      throw new DataRetrievalException(
        "cannot find zoning district classes given an id",
      );
    }
  }

  async findZoningDistrictTilesets(params: {
    z: number;
    x: number;
    y: number;
  }) {
    return `${this.storageConfig.storageUrl}/tilesets/zoning_district/${params.z}/${params.x}/${params.y}.pbf`;
  }
}
