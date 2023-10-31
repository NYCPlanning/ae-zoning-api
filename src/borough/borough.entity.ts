import { Entity, PrimaryKey, Property, types } from "@mikro-orm/core";

@Entity()
export class Borough {
  @PrimaryKey({ columnType: "char(1)" })
  id: string;

  @Property({ type: types.text })
  title!: string;

  @Property({ type: types.text })
  abbr!: string;

  constructor(id: string, title: string, abbr: string) {
    this.id = id;
    this.title = title;
    this.abbr = abbr;
  }
}
