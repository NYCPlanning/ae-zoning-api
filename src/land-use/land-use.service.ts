import { Inject, Injectable } from "@nestjs/common";
import { LandUseRepository } from "./land-use.repository";
@Injectable()
export class LandUseService {
  constructor(
    @Inject(LandUseRepository)
    private readonly landUseRepository: LandUseRepository,
  ) {}

  async findMany() {
    const landUses = await this.landUseRepository.findMany();
    return {
      landUses,
    };
  }
}
