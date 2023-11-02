import {
  Entity,
  PrimaryKey,
  Property,
  types,
  UuidType,
  ManyToMany,
  Collection,
} from "@mikro-orm/core";
import { MultiPolygonGeogType, MultiPolygonGeomType } from "../mikro-orm-pgis";
import { MultiPolygon } from "geojson";
import { ZoningDistrictClass } from "../zoning-district-class/zoning-district-class.entity";

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

  @ManyToMany(() => ZoningDistrictClass)
  classes: Collection<ZoningDistrictClass> =
    new Collection<ZoningDistrictClass>(this);

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
