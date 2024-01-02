import { Inject, Injectable } from "@nestjs/common";
import { LandUseRepository } from "./land-use.repository";
@Injectable()
export class LandUseService {
  constructor(
    @Inject(LandUseRepository)
    private readonly landUseRepository: LandUseRepository,
  ) {}

  async findAll() {
    const landUses = await this.landUseRepository.findAll();
    return {
      landUses,
    };
  }
}
