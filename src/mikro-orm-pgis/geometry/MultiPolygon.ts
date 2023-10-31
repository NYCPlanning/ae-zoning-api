import { Type } from "@mikro-orm/core";
import { MultiPolygon } from "geojson";
import { SimpleFeature } from "..";

export class MultiPolygonGeomType extends Type<MultiPolygon, string> {
  constructor(srid = 3857) {
    super();
    this.srid = srid;
  }

  srid: number;

  getColumnType(): string {
    return `geometry(${SimpleFeature.MultiPolygon}, ${this.srid})`;
  }
}
