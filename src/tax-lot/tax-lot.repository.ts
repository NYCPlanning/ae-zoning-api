import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq, isNotNull, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  landUse,
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
  FindFillsRepoSchema,
  FindLabelsRepoSchema,
} from "./tax-lot.repository.schema";
import { Geometry } from "geojson";
import { Geom } from "src/types";
import { FindTaxLotFillsPathParams, FindTaxLotLabelsPathParams } from "src/gen";

export class TaxLotRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkTaxLotByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        bbl: true,
      },
      where: (taxLot, { eq, sql }) => eq(taxLot.bbl, sql.placeholder("bbl")),
    })
    .prepare("checkByBbl");

  async findFills(
    params: FindTaxLotFillsPathParams,
  ): Promise<FindFillsRepoSchema> {
    const { z, x, y } = params;
    try {
      const tile = this.db
        .select({
          bbl: taxLot.bbl,
          color: sql`'['
        ||('x'||SUBSTRING(${landUse.color}, 2, 2))::bit(8)::int||','
        ||('x'||SUBSTRING(${landUse.color}, 4, 2))::bit(8)::int||','
        ||('x'||SUBSTRING(${landUse.color}, 6, 2))::bit(8)::int||','
        ||('x'||SUBSTRING(${landUse.color}, 8, 2))::bit(8)::int||
        ']'`.as("color"),
          geom: sql`ST_AsMVTGeom(
				  ${taxLot.mercatorFill},
				  ST_TileEnvelope(${z}, ${x}, ${y}),
				  4096, 64, true)`.as("geom"),
        })
        .from(taxLot)
        .leftJoin(landUse, eq(landUse.id, taxLot.landUseId))
        .where(sql`${taxLot.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`)
        .as("tile");

      return this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'tax_lot_fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findLabels(
    params: FindTaxLotLabelsPathParams,
  ): Promise<FindLabelsRepoSchema> {
    const { z, x, y } = params;
    try {
      const tile = this.db
        .select({
          bbl: taxLot.bbl,
          geom: sql`ST_AsMVTGeom(
            ${taxLot.mercatorLabel},
            ST_TileEnvelope(${z}, ${x}, ${y})
          )`.as("geom"),
        })
        .from(taxLot)
        .where(sql`${taxLot.mercatorFill} && ST_TileEnvelope(${z}, ${x}, ${y})`)
        .as("tile");

      return await this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'tax_lot_label', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async checkByBbl(bbl: string): Promise<CheckByBblRepo | undefined> {
    try {
      return await this.#checkTaxLotByBbl.execute({ bbl });
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
      throw new DataRetrievalException();
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
      throw new DataRetrievalException();
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
          geometry: sql<string>`ST_AsGeoJSON(${taxLot.wgs84}, 6)`.as(
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
      throw new DataRetrievalException();
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
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictClassesByBbl(
    bbl: string,
  ): Promise<FindZoningDistrictClassesByBblRepo> {
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
        .where(eq(taxLot.bbl, bbl));
    } catch {
      throw new DataRetrievalException();
    }
  }
}
