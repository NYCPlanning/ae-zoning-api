import { Entity, PrimaryKey, Property, types, UuidType } from "@mikro-orm/core";
import { MultiPolygonGeogType, MultiPolygonGeomType } from "../mikro-orm-pgis";
import { MultiPolygon } from "geojson";

@Entity()
export class ZoningDistrict {
  @PrimaryKey({ type: UuidType })
  id: string;

  @Property({ type: types.text })
  label: string;

  @Property({ type: new MultiPolygonGeogType(4326) })
  wgs84: MultiPolygon;

  @Property({ type: new MultiPolygonGeomType(2263) })
  liFt: MultiPolygon;

  constructor(
    id: string,
    label: string,
    wgs84: MultiPolygon,
    liFt: MultiPolygon,
  ) {
    this.id = id;
    this.label = label;
    this.wgs84 = wgs84;
    this.liFt = liFt;
  }
}
