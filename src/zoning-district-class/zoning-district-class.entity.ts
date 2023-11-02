import { Entity, PrimaryKey, Property, types, Enum } from "@mikro-orm/core";

@Entity()
export class ZoningDistrictClass {
  @PrimaryKey({ type: types.text })
  id: string;

  @Enum(() => ZoningDistrictClassCategory)
  category: ZoningDistrictClassCategory;

  @Property({ type: types.text })
  description: string;

  @Property({ columnType: "char(9)" })
  color: string;

  constructor(
    id: string,
    category: ZoningDistrictClassCategory,
    description: string,
    color: string,
  ) {
    this.id = id;
    this.category = category;
    this.description = description;
    this.color = color;
  }
}

export enum ZoningDistrictClassCategory {
  Residential = "Residential",
  Commercial = "Commercial",
  Manufacturing = "Manufacturing",
}
