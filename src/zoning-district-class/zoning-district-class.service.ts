import { Inject, Injectable } from "@nestjs/common";
import { FeatureFlagConfig } from "src/config";
import { DB, DbType } from "src/global/providers/db.provider";
import { ConfigType } from "@nestjs/config";
import { zoningDistrictClass } from "src/schema";
import { eq } from "drizzle-orm";
import { DataRetrievalException, ResourceNotFoundException } from "src/error";
import { SelectZoningDistrictClass } from "src/schema/zoning-district-class";

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
      try {
        const zoningDistrictClasses =
          await this.db.query.zoningDistrictClass.findMany();
        return {
          zoningDistrictClasses,
        };
      } catch {
        throw DataRetrievalException;
      }
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }

  async findZoningDistrictClassById(id: string) {
    if (this.featureFlagConfig.useDrizzle) {
      let result: SelectZoningDistrictClass | undefined;

      try {
        result = await this.db.query.zoningDistrictClass.findFirst({
          where: eq(zoningDistrictClass.id, id),
        });
      } catch {
        throw DataRetrievalException;
      }

      if (result === undefined) throw ResourceNotFoundException;
      return result;
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }

  async findZoningDistrictClassCategoryColors() {
    if (this.featureFlagConfig.useDrizzle) {
      try {
        const zoningDistrictClassCategoryColors = await this.db
          .selectDistinctOn([zoningDistrictClass.category], {
            category: zoningDistrictClass.category,
            color: zoningDistrictClass.color,
          })
          .from(zoningDistrictClass);

        return {
          zoningDistrictClassCategoryColors,
        };
      } catch {
        throw DataRetrievalException;
      }
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }
}
