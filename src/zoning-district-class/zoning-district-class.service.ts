import { Inject, Injectable } from "@nestjs/common";
import { FeatureFlagConfig } from "src/config";
import { DB, DbType } from "src/global/providers/db.provider";
import { ConfigType } from "@nestjs/config";
import { zoningDistrictClass } from "src/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @Inject(DB)
    private readonly db: DbType,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAllZoningDistrictClasses() {
    if (this.featureFlagConfig.useDrizzle) {
      const zoningDistrictClasses =
        await this.db.query.zoningDistrictClass.findMany();
      return {
        zoningDistrictClasses,
      };
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }

  async findZoningDistrictClassById(id: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const result = await this.db.query.zoningDistrictClass.findFirst({
        where: eq(zoningDistrictClass.id, id),
      });
      return result === undefined ? null : result;
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }

  async findZoningDistrictClassCategoryColors() {
    if (this.featureFlagConfig.useDrizzle) {
      const zoningDistrictClassCategoryColors = await this.db
        .selectDistinctOn([zoningDistrictClass.category], {
          category: zoningDistrictClass.category,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass);

      return {
        zoningDistrictClassCategoryColors,
      };
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }
}