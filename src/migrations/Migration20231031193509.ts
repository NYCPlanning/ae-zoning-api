import { Migration } from "@mikro-orm/migrations";

export class Migration20231031193509 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tax_lot" ("bbl" char(10) not null, "block" text not null, "lot" text not null, "address" text not null, "wgs84" geography(MultiPolygon, 4326) not null, "li_ft" geometry(MultiPolygon, 2263) not null, constraint "tax_lot_pkey" primary key ("bbl"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tax_lot" cascade;');
  }
}
