import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { Geometry } from "geojson";
import { Geom } from "src/types";
import { sql } from "drizzle-orm";
import {
  CheckGeomIsValidRepo,
  FindGeomBufferRepo,
  FindGeomFromGeoJsonRepo,
  FindMaximumInscribedCircleCenterRepo,
} from "./spatial.repository.schema";
import { DataRetrievalException } from "src/exception";

export class SpatialRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

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
      throw new DataRetrievalException("cannot find geom given geojson");
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
      throw new DataRetrievalException("cannot find geom buffer");
    }
  }

  async checkGeomIsValid(geom: Geom): Promise<CheckGeomIsValidRepo> {
    try {
      const result = await this.db.execute(
        sql`SELECT ST_IsValid(${geom}) AS valid`,
      );
      return result.rows[0].valid as boolean;
    } catch {
      throw new DataRetrievalException("cannot find geom");
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
      throw new DataRetrievalException(
        "cannot find maximum inscribed circle center",
      );
    }
  }
}
