import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import { eq } from "drizzle-orm";

// import { ZoningDistrictClass } from "../zoning-district-class/zoning-district-class.entity";
import { ZoningDistrictClassRepository } from "../zoning-district-class/zoning-district-class.repository";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(DB)
    private readonly db: DbType,

    @InjectRepository(ZoningDistrict)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
    private readonly zoningDistrictClassRepository: ZoningDistrictClassRepository,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  async findZoningDistrictByUuid(uuid: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const result = await this.db.query.zoningDistrict.findFirst({
        columns: { wgs84: false, liFt: false },
        where: eq(zoningDistrict.id, uuid),
      });
      return result === undefined ? null : result;
    } else {
      return this.zoningDistrictRepository.findOne(uuid, {
        fields: ["id", "label"],
      });
    }
  }

  async findClassesByZoningDistrictUuid(uuid: string) {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.db
        .select({
          id: zoningDistrictClass.id,
          category: zoningDistrictClass.category,
          description: zoningDistrictClass.description,
          url: zoningDistrictClass.url,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass)
        .leftJoin(
          zoningDistrictZoningDistrictClass,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictClassId,
            zoningDistrictClass.id,
          ),
        )
        .leftJoin(
          zoningDistrict,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictId,
            zoningDistrict.id,
          ),
        )
        .where(eq(zoningDistrict.id, uuid));
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }
}
