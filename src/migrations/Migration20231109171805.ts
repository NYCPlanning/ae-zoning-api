import { Migration } from "@mikro-orm/migrations";

export class Migration20231108203245 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `copy borough ("id", "title", "abbr") from '../borough.csv' delimiter ',' csv header;`,
    );
    this.addSql(
      `copy land_use ("id", "description", "color") from '../land_use.csv' delimiter ',' csv header;`,
    );
    this.addSql(
      `copy tax_lot ("bbl", "borough_id", "block", "lot", "address", "land_use_id", "wgs84", "li_ft") from '../tax_lot.csv' delimiter ',' csv header;`,
    );
    this.addSql(
      `copy zoning_district ("id", "label", "wgs84", "li_ft") from '../zoning_district.csv' delimiter ',' csv header;`,
    );
    this.addSql(
      `copy zoning_district_class("id", "category", "description", "url", "color") from '../zoning_district_class.csv' delimiter ',' csv header;`,
    );
    this.addSql(
      `copy zoning_district_classes ("zoning_district_id", "zoning_district_class_id") from '../zoning_district_zoning_district_class.csv' delimiter ',' csv header;`,
    );
  }

  async down(): Promise<void> {
    this.addSql("delete from zoning_district_zoning_district_class;");
    this.addSql("delete from zoning_district_class;");
    this.addSql("delete from zoning_district;");
    this.addSql("delete from tax_lot;");
    this.addSql("delete from land_use;");
    this.addSql("delete from borough;");
  }
}
