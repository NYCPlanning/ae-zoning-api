import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { LandUse } from "./land-use.entity";
import { LandUseRepository } from "./land-use.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { LandUseRepo } from "./land-use.repo";
@Injectable()
export class LandUseService {
  constructor(
    @InjectRepository(LandUse)
    private readonly landUseRepository: LandUseRepository,

    @Inject(LandUseRepo)
    private readonly landUseRepo: LandUseRepo,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAll() {
    if (this.featureFlagConfig.useDrizzle) {
      const landUses = await this.landUseRepo.findAll();
      return {
        landUses,
      };
    } else {
      return this.landUseRepository.findAll();
    }
  }
}
