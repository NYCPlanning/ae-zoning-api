import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { StorageConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { and, eq, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
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
  FindGeomBufferRepo,
  FindMaximumInscribedCircleCenterRepo,
  CheckGeomIsValidRepo,
  FindGeomFromGeoJsonRepo,
} from "./tax-lot.repository.schema";
import { Geometry } from "geojson";
import { Geom } from "src/types";
import {
  FindTaxLotByBblPathParams,
  FindTaxLotGeoJsonByBblPathParams,
  FindZoningDistrictClassesByTaxLotBblPathParams,
  FindZoningDistrictsByTaxLotBblPathParams,
} from "src/gen";

export class TaxLotRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  #checkTaxLotByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        boroughId: true,
        blockId: true,
        lotId: true,
      },
      where: (taxLot, { and, eq, sql }) =>
        and(
          eq(taxLot.boroughId, sql.placeholder("boroughId")),
          eq(taxLot.blockId, sql.placeholder("blockId")),
          eq(taxLot.lotId, sql.placeholder("lotId")),
        ),
    })
    .prepare("checkByBbl");

  async checkByBbl({
    boroughId,
    blockId,
    lotId,
  }: {
    boroughId: string;
    blockId: string;
    lotId: string;
  }): Promise<CheckByBblRepo | undefined> {
    try {
      return await this.#checkTaxLotByBbl.execute({
        boroughId,
        blockId,
        lotId,
      });
    } catch {
      throw new DataRetrievalException();
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
          boroughId: true,
          blockId: true,
          lotId: true,
          address: true,
          landUseId: true,
        },
        limit,
        offset,
        orderBy: [taxLot.boroughId, taxLot.blockId, taxLot.lotId],
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findGeomFromGeoJson(
    shape: Geometry,
    targetSrid = 4326,
  ): Promise<FindGeomFromGeoJsonRepo> {
    try {
      const result = await this.db.execute(
        sql`SELECT ST_Transform(ST_GeomFromGeoJSON(${shape}), CAST(${targetSrid} AS INTEGER)) AS geom`,
      );
      return result.rows[0].geom as Geom;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findGeomBuffer(
    geom: Geom,
    buffer: number,
  ): Promise<FindGeomBufferRepo> {
    try {
      const result = await this.db.execute(
        sql`SELECT ST_Buffer(${geom}, ${buffer}) AS buffer`,
      );
      return result.rows[0].buffer as Geom;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async checkGeomIsValid(geom: Geom): Promise<CheckGeomIsValidRepo> {
    try {
      const result = await this.db.execute(
        sql`SELECT ST_IsValid(${geom}) AS valid`,
      );
      return result.rows[0].valid as boolean;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMaximumInscribedCircleCenter(
    geom: Geom,
  ): Promise<FindMaximumInscribedCircleCenterRepo> {
    try {
      const result = await this.db.execute(
        sql`SELECT (ST_MaximumInscribedCircle(${geom})).center AS center`,
      );
      return result.rows[0].center as Geom;
    } catch {
      throw new DataRetrievalException();
    }
  }

  #findManyBySpatialFilter = this.db.query.taxLot
    .findMany({
      columns: {
        boroughId: true,
        blockId: true,
        lotId: true,
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
      throw new DataRetrievalException();
    }
  }

  async findByBbl({
    boroughId,
    blockId,
    lotId,
  }: FindTaxLotByBblPathParams): Promise<FindByBblRepo | undefined> {
    try {
      return await this.db.query.taxLot.findFirst({
        columns: {
          boroughId: false,
          landUseId: false,
          wgs84: false,
          liFt: false,
        },
        where: (taxLot, { eq, and }) =>
          and(
            eq(taxLot.boroughId, boroughId),
            eq(taxLot.blockId, blockId),
            eq(taxLot.lotId, lotId),
          ),
        with: {
          borough: true,
          landUse: true,
        },
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findByBblSpatial({
    boroughId,
    blockId,
    lotId,
  }: FindTaxLotGeoJsonByBblPathParams): Promise<
    FindByBblSpatialRepo | undefined
  > {
    try {
      return await this.db.query.taxLot.findFirst({
        columns: {
          blockId: true,
          lotId: true,
          address: true,
        },
        extras: {
          geometry: sql<string>`ST_AsGeoJSON(${taxLot.wgs84}, 6)`.as(
            "geometry",
          ),
        },
        where: (taxLot, { and, eq }) =>
          and(
            eq(taxLot.boroughId, boroughId),
            eq(taxLot.blockId, blockId),
            eq(taxLot.lotId, lotId),
          ),
        with: {
          borough: true,
          landUse: true,
        },
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictsByBbl({
    boroughId,
    blockId,
    lotId,
  }: FindZoningDistrictsByTaxLotBblPathParams): Promise<FindZoningDistrictsByBblRepo> {
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
        .where(
          and(
            eq(taxLot.boroughId, boroughId),
            eq(taxLot.blockId, blockId),
            eq(taxLot.lotId, lotId),
          ),
        );
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictClassesByBbl({
    boroughId,
    blockId,
    lotId,
  }: FindZoningDistrictClassesByTaxLotBblPathParams): Promise<FindZoningDistrictClassesByBblRepo> {
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
        .leftJoin(
          taxLot,
          sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
        )
        .where(
          and(
            eq(taxLot.boroughId, boroughId),
            eq(taxLot.blockId, blockId),
            eq(taxLot.lotId, lotId),
          ),
        );
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findTilesets(params: { z: number; x: number; y: number }) {
    return `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`;
  }
}
