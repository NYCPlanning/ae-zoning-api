import { FindCapitalProjectTilesPathParams } from "src/gen";
import { CapitalProjectRepository } from "./capital-project.repository";
import { Inject } from "@nestjs/common";

export class CapitalProjectService {
  constructor(
    @Inject(CapitalProjectRepository)
    private readonly capitalProjectRepository: CapitalProjectRepository,
  ) {}

  async findTiles(params: FindCapitalProjectTilesPathParams) {
    return await this.capitalProjectRepository.findTiles(params);
  }
}
