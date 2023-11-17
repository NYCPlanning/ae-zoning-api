import { customType } from ".";
import {
  Geometry,
  Point,
  LineString,
  MultiLineString,
  GeometryCollection,
  MultiPolygon,
  Polygon,
  MultiPoint,
} from "geojson";
import { SimpleFeature } from "./types";

export const geometry =
  <T extends Geometry>(sf: SimpleFeature) =>
  (name: string, srid = 3857) =>
    customType<{ data: T }>({
      dataType() {
        return `geometry(${sf},${srid})`;
      },
    })(name);

export const pointGeom = geometry<Point>(SimpleFeature.POINT);

export const multiPointGeom = geometry<MultiPoint>(SimpleFeature.MULTI_POINT);

export const lineStringGeom = geometry<LineString>(SimpleFeature.LINE_STRING);

export const multiLineStringGeom = geometry<MultiLineString>(
  SimpleFeature.MULTI_LINE_STRING,
);

export const polygonGeom = geometry<Polygon>(SimpleFeature.POLYGON);

export const multiPolygonGeom = geometry<MultiPolygon>(
  SimpleFeature.MULTI_POLYGON,
);

export const geometryCollectionGeom = geometry<GeometryCollection>(
  SimpleFeature.GEOMETRY_COLLECTION,
);
