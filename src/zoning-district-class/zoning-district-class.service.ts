import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { Inject, Injectable } from "@nestjs/common";
import { FeatureFlagConfig } from "src/config";
import { DB, DbType } from "src/global/providers/db.provider";
import { ConfigType } from "@nestjs/config";
import { zoningDistrictClass } from "src/schema";
import { eq } from "drizzle-orm";
import { InjectRepository } from "@mikro-orm/nestjs";
import { ZoningDistrictClass } from "./zoning-district-class.entity";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @Inject(DB)
    private readonly db: DbType,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,

    @InjectRepository(ZoningDistrictClass)
    private readonly zoningDistrictClassRepository: ZoningDistrictClassRepository,
  ) {}

  async findAllZoningDistrictClasses() {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.db.query.zoningDistrictClass.findMany();
    } else {
      return await this.zoningDistrictClassRepository.findAll();
    }
  }

  async findZoningDistrictClassById(id: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const result = await this.db.query.zoningDistrictClass.findFirst({
        where: eq(zoningDistrictClass.id, id),
      });
      return result === undefined ? null : result;
    } else {
      return this.zoningDistrictClassRepository.findOne(id, {
        fields: ["id", "category", "description", "url", "color"],
      });
    }
  }

  async findZoningDistrictClassCategoryColors() {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.db
        .selectDistinctOn([zoningDistrictClass.category], {
          category: zoningDistrictClass.category,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass);
    } else {
      // const qb = this.em.createQueryBuilder(ZoningDistrictClass, "zdc");
      // console.log("qqqqbbbb", qb);
      // qb.select(["zdc.category", "zdc.color"]).orderBy({
      //   category: QueryOrder.ASC,
      //   color: QueryOrder.ASC,
      // });
      const connection = this.em.getConnection();
      const res = await connection.execute(`
        SELECT 
        DISTINCT ON (category) category, color 
        FROM zoning_district_class 
        ORDER BY category, color
      `);

      return res;
    }
  }
}
