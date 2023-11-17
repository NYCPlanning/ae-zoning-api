import { PgColumn } from "drizzle-orm/pg-core";
import { Geometry } from "geojson";
import { sql } from "drizzle-orm";

/**
 * https://postgis.net/docs/ST_AsGeoJSON.html
 * @returns a geometry or geography as a GeoJSON "geometry"
 */
export const ST_AsGeoJSON = (
  feature: PgColumn<{
    name: string;
    tableName: string;
    dataType: "custom";
    columnType: "PgCustomColumn";
    data: Geometry;
    driverParam: unknown;
    notNull: false;
    hasDefault: false;
    enumValues: undefined;
    baseColumn: never;
  }>,
  maxDecimalDigits = 9,
) => sql<string>`ST_AsGeoJSON(${feature}, ${maxDecimalDigits})`;
