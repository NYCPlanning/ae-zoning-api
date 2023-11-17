import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { LandUse } from "./land-use.entity";
import { LandUseRepository } from "./land-use.repository";
import { DB, DbType } from "src/global/providers/db.provider";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class LandUseService {
  constructor(
    @InjectRepository(LandUse)
    private readonly landUseRepository: LandUseRepository,

    @Inject(DB)
    private readonly db: DbType,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAll() {
    if (this.featureFlagConfig.useDrizzle) {
      return this.db.query.landUse.findMany();
    } else {
      return this.landUseRepository.findAll();
    }
  }
}
