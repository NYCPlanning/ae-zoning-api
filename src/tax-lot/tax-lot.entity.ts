import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  types,
} from "@mikro-orm/core";
import { MultiPolygonGeogType, MultiPolygonGeomType } from "../mikro-orm-pgis";
import { MultiPolygon } from "geojson";
import { Borough } from "../borough/borough.entity";
import { LandUse } from "../land-use/land-use.entity";

@Entity()
export class TaxLot {
  @PrimaryKey({ columnType: "char(10)" })
  bbl: string;

  @ManyToOne({ entity: () => Borough })
  borough: Borough;

  @Property({ type: types.text })
  block: string;

  @Property({ type: types.text })
  lot: string;

  @Property({ type: types.text, nullable: true })
  address: string;

  @ManyToOne({ entity: () => LandUse, nullable: true })
  landUse: LandUse;

  @Property({ type: new MultiPolygonGeogType(4326) })
  wgs84: MultiPolygon;

  @Property({ type: new MultiPolygonGeomType(2263) })
  liFt: MultiPolygon;

  constructor(
    bbl: string,
    block: string,
    lot: string,
    address: string,
    wgs84: MultiPolygon,
    liFt: MultiPolygon,
  ) {
    this.bbl = bbl;
    this.block = block;
    this.lot = lot;
    this.address = address;
    this.wgs84 = wgs84;
    this.liFt = liFt;
  }
}
