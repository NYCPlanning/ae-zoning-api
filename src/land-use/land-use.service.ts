import { Inject, Injectable } from "@nestjs/common";
import { LandUseRepo } from "./land-use.repo";
@Injectable()
export class LandUseService {
  constructor(
    @Inject(LandUseRepo)
    private readonly landUseRepo: LandUseRepo,
  ) {}

  async findAll() {
    const landUses = await this.landUseRepo.findAll();
    return {
      landUses,
    };
  }
}
