import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { LandUse } from "./land-use.entity";
import { LandUseRepository } from "./land-use.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class LandUseService {
  constructor(
    @InjectRepository(LandUse)
    private readonly landUseRepository: LandUseRepository,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAll(): Promise<LandUse[]> {
    if (this.featureFlagConfig.useDrizzle)
      throw new Error("Land uses route not support in drizzle");
    return this.landUseRepository.findAll();
  }
}
