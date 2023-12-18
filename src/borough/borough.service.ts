import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { Borough } from "./borough.entity";
import { BoroughRepository } from "./borough.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { BoroughRepo } from "./borough.repo";

@Injectable()
export class BoroughService {
  constructor(
    @InjectRepository(Borough)
    private readonly boroughRepository: BoroughRepository,

    @Inject(BoroughRepo)
    private readonly boroughRepo: BoroughRepo,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAll() {
    if (this.featureFlagConfig.useDrizzle) {
      const boroughs = await this.boroughRepo.findAll();
      return {
        boroughs,
      };
    } else {
      return this.boroughRepository.findAll();
    }
  }
}
