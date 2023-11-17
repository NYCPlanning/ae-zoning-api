import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { Borough } from "./borough.entity";
import { BoroughRepository } from "./borough.repository";
import { DB, DbType } from "src/global/providers/db.provider";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class BoroughService {
  constructor(
    @InjectRepository(Borough)
    private readonly boroughRepository: BoroughRepository,

    @Inject(DB)
    private readonly db: DbType,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAll() {
    if (this.featureFlagConfig.useDrizzle) {
      return this.db.query.borough.findMany();
    } else {
      return this.boroughRepository.findAll();
    }
  }
}
