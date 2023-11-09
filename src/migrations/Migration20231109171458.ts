import { Migration } from "@mikro-orm/migrations";

export class Migration20231109171458 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "tax_lot" drop constraint "tax_lot_land_use_id_foreign";',
    );

    this.addSql(
      'alter table "tax_lot" alter column "address" type text using ("address"::text);',
    );
    this.addSql('alter table "tax_lot" alter column "address" drop not null;');
    this.addSql(
      'alter table "tax_lot" alter column "land_use_id" type char(2) using ("land_use_id"::char(2));',
    );
    this.addSql(
      'alter table "tax_lot" alter column "land_use_id" drop not null;',
    );
    this.addSql(
      'alter table "tax_lot" add constraint "tax_lot_land_use_id_foreign" foreign key ("land_use_id") references "land_use" ("id") on update cascade on delete set null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "tax_lot" drop constraint "tax_lot_land_use_id_foreign";',
    );

    this.addSql(
      'alter table "tax_lot" alter column "address" type text using ("address"::text);',
    );
    this.addSql('alter table "tax_lot" alter column "address" set not null;');
    this.addSql(
      'alter table "tax_lot" alter column "land_use_id" type char(2) using ("land_use_id"::char(2));',
    );
    this.addSql(
      'alter table "tax_lot" alter column "land_use_id" set not null;',
    );
    this.addSql(
      'alter table "tax_lot" add constraint "tax_lot_land_use_id_foreign" foreign key ("land_use_id") references "land_use" ("id") on update cascade;',
    );
  }
}
