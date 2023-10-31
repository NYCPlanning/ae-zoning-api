import { Migration } from "@mikro-orm/migrations";

export class Migration20231031204246 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "tax_lot" ("bbl" char(10) not null, "borough_id" char(1) not null, "block" text not null, "lot" text not null, "address" text not null, "land_use_id" char(2) not null, "wgs84" geography(MultiPolygon, 4326) not null, "li_ft" geometry(MultiPolygon, 2263) not null, constraint "tax_lot_pkey" primary key ("bbl"));',
    );

    this.addSql(
      'alter table "tax_lot" add constraint "tax_lot_borough_id_foreign" foreign key ("borough_id") references "borough" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "tax_lot" add constraint "tax_lot_land_use_id_foreign" foreign key ("land_use_id") references "land_use" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "tax_lot" cascade;');
  }
}
