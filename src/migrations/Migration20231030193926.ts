import { Migration } from "@mikro-orm/migrations";

export class Migration20231030193926 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "borough" ("id" char(1) not null, "title" text not null, "abbr" text not null, constraint "borough_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "borough" cascade;');
  }
}
