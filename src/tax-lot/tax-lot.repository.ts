import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { StorageConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { eq, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  MultiPolygonJson,
  taxLot,
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import {
  FindByBblRepo,
  FindByBblSpatialRepo,
  CheckByBblRepo,
  FindZoningDistrictsByBblRepo,
  FindZoningDistrictClassesByBblRepo,
  FindManyRepo,
  FindManyBySpatialFilterRepo,
} from "./tax-lot.repository.schema";
import { Geom } from "src/types";
import { ZoningDistrictClassCategory } from "src/gen";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

export class TaxLotRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        bbl: true,
      },
      where: (taxLot, { eq, sql }) => eq(taxLot.bbl, sql.placeholder("bbl")),
    })
    .prepare("checkByBbl");

  async checkByBbl(bbl: string): Promise<CheckByBblRepo> {
    const key = JSON.stringify({
      bbl,
      domain: "taxlot",
      function: "checkByBbl",
    });
    const cachedValue = await this.cacheManager.get<boolean>(key);
    if (cachedValue !== undefined) return cachedValue;

    try {
      const result = await this.#checkByBbl.execute({ bbl });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException("cannot find tax lot given a bbl");
    }
  }

  async findMany({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<FindManyRepo> {
    try {
      return await this.db.query.taxLot.findMany({
        columns: {
          bbl: true,
          boroughId: true,
          block: true,
          lot: true,
          address: true,
          landUseId: true,
        },
        limit,
        offset,
        orderBy: taxLot.bbl,
      });
    } catch {
      throw new DataRetrievalException("cannot find tax lots");
    }
  }

  #findManyBySpatialFilter = this.db.query.taxLot
    .findMany({
      columns: {
        bbl: true,
        boroughId: true,
        block: true,
        lot: true,
        address: true,
        landUseId: true,
      },
      where: (taxLot, { sql }) =>
        sql`ST_Intersects(${taxLot.liFt},${sql.placeholder("intersectGeom")})`,
      limit: sql.placeholder("limit"),
      offset: sql.placeholder("offset"),
      orderBy: (taxLot, { sql }) =>
        sql`${taxLot.liFt} <-> ${sql.placeholder("orderGeom")}`,
    })
    .prepare("findManyBySpatialFilter");

  async findManyBySpatialFilter({
    limit,
    offset,
    intersectGeom,
    orderGeom,
  }: {
    limit: number;
    offset: number;
    intersectGeom: Geom;
    orderGeom: Geom;
  }): Promise<FindManyBySpatialFilterRepo> {
    try {
      return await this.#findManyBySpatialFilter.execute({
        limit,
        offset,
        intersectGeom,
        orderGeom,
      });
    } catch {
      throw new DataRetrievalException(
        "cannot find tax lots given spatial filter",
      );
    }
  }

  async findByBbl(bbl: string): Promise<FindByBblRepo | undefined> {
    try {
      return await this.db.query.taxLot.findFirst({
        columns: {
          boroughId: false,
          landUseId: false,
          wgs84: false,
          liFt: false,
        },
        where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
        with: {
          borough: true,
          landUse: true,
        },
      });
    } catch {
      throw new DataRetrievalException("cannot find tax lot given a bbl");
    }
  }

  async findByBblSpatial(
    bbl: string,
  ): Promise<FindByBblSpatialRepo | undefined> {
    try {
      return await this.db.query.taxLot.findFirst({
        columns: {
          bbl: true,
          block: true,
          lot: true,
          address: true,
        },
        extras: {
          geometry: sql<MultiPolygonJson>`ST_AsGeoJSON(${taxLot.wgs84}, 6)`.as(
            "geometry",
          ),
        },
        where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
        with: {
          borough: true,
          landUse: true,
        },
      });
    } catch {
      throw new DataRetrievalException("cannot find spatial tax lot given bbl");
    }
  }

  async findZoningDistrictsByBbl(
    bbl: string,
  ): Promise<FindZoningDistrictsByBblRepo> {
    try {
      return await this.db
        .select({
          id: zoningDistrict.id,
          label: zoningDistrict.label,
        })
        .from(zoningDistrict)
        .leftJoin(
          taxLot,
          sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
        )
        .where(eq(taxLot.bbl, bbl));
    } catch {
      throw new DataRetrievalException(
        "cannot find zoning districts given a bbl",
      );
    }
  }

  async findZoningDistrictClassesByBbl(
    bbl: string,
  ): Promise<FindZoningDistrictClassesByBblRepo> {
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
        .leftJoin(
          taxLot,
          sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
        )
        .where(eq(taxLot.bbl, bbl));
    } catch {
      throw new DataRetrievalException(
        "cannot find zoning district classes given a bbl",
      );
    }
  }

  async findTilesets(params: { z: number; x: number; y: number }) {
    return `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`;
  }
}
