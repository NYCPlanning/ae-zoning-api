import { Migration } from "@mikro-orm/migrations";

export class Migration20231031181657 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "land_use" ("id" char(2) not null, "description" text not null, "color" char(9) not null, constraint "land_use_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "land_use" cascade;');
  }
}
