import { Inject, Injectable } from "@nestjs/common";
import { CapitalCommitmentTypeRepository } from "./capital-commitment-type.repository";
@Injectable()
export class CapitalCommitmentTypeService {
  constructor(
    @Inject(CapitalCommitmentTypeRepository)
    private readonly capitalCommitmentRepository: CapitalCommitmentTypeRepository,
  ) {}

  async findMany() {
    const capitalCommitmentTypes =
      await this.capitalCommitmentRepository.findMany();
    return {
      capitalCommitmentTypes,
    };
  }
}
