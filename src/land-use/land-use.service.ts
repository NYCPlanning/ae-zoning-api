import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { LandUse } from "./land-use.entity";
import { LandUseRepository } from "./land-use.repository";

@Injectable()
export class LandUseService {
  constructor(
    @InjectRepository(LandUse)
    private readonly landUseRepository: LandUseRepository,
  ) {}

  async findAll(): Promise<LandUse[]> {
    return this.landUseRepository.findAll();
  }
}
