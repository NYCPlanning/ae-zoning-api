import { SimpleFeature } from "./types";
import { customType } from ".";
import {
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from "geojson";

export const geography =
  <T extends Geometry>(sf: SimpleFeature) =>
  (name: string, srid = 4326) =>
    customType<{ data: T }>({
      dataType() {
        return `geography(${sf}, ${srid})`;
      },
    })(name);

export const pointGeog = geography<Point>(SimpleFeature.POINT);

export const multiPointGeog = geography<MultiPoint>(SimpleFeature.MULTI_POINT);

export const lineStringGeog = geography<LineString>(SimpleFeature.LINE_STRING);

export const multiLineStringGeog = geography<MultiLineString>(
  SimpleFeature.MULTI_LINE_STRING,
);

export const polygonGeog = geography<Polygon>(SimpleFeature.POLYGON);

export const multiPolygonGeog = geography<MultiPolygon>(
  SimpleFeature.MULTI_POLYGON,
);

export const geometryCollectionGeog = geography<GeometryCollection>(
  SimpleFeature.GEOMETRY_COLLECTION,
);
