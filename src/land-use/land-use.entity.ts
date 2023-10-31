import { Entity, PrimaryKey, Property, types } from "@mikro-orm/core";

@Entity()
export class LandUse {
  @PrimaryKey({ columnType: "char(2)" })
  id: string;

  @Property({ type: types.text })
  description: string;

  @Property({ columnType: "char(9)" })
  color: string;

  constructor(id: string, description: string, color: string) {
    this.id = id;
    this.description = description;
    this.color = color;
  }
}
