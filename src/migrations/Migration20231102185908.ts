import { Migration } from "@mikro-orm/migrations";

export class Migration20231102185908 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "zoning_district" ("id" uuid not null default gen_random_uuid(), "label" text not null, "wgs84" geography(MultiPolygon, 4326) not null, "li_ft" geometry(MultiPolygon, 2263) not null, constraint "zoning_district_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "zoning_district_class" ("id" text not null, "category" text check ("category" in (\'Residential\', \'Commercial\', \'Manufacturing\')) not null, "description" text not null, "url" text null, "color" char(9) not null, constraint "zoning_district_class_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "zoning_district_classes" ("zoning_district_id" uuid not null, "zoning_district_class_id" text not null, constraint "zoning_district_classes_pkey" primary key ("zoning_district_id", "zoning_district_class_id"));',
    );

    this.addSql(
      'alter table "zoning_district_classes" add constraint "zoning_district_classes_zoning_district_id_foreign" foreign key ("zoning_district_id") references "zoning_district" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "zoning_district_classes" add constraint "zoning_district_classes_zoning_district_class_id_foreign" foreign key ("zoning_district_class_id") references "zoning_district_class" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "zoning_district_classes" drop constraint "zoning_district_classes_zoning_district_id_foreign";',
    );

    this.addSql(
      'alter table "zoning_district_classes" drop constraint "zoning_district_classes_zoning_district_class_id_foreign";',
    );

    this.addSql('drop table if exists "zoning_district" cascade;');

    this.addSql('drop table if exists "zoning_district_class" cascade;');

    this.addSql('drop table if exists "zoning_district_classes" cascade;');
  }
}
