import { Type } from "@mikro-orm/core";
import { MultiPolygon } from "geojson";
import { SimpleFeature } from "..";

export class MultiPolygonGeogType extends Type<MultiPolygon, string> {
  constructor(srid = 4326) {
    super();
    this.srid = srid;
  }

  srid: number;

  getColumnType(): string {
    return `geography(${SimpleFeature.MultiPolygon}, ${this.srid})`;
  }
}