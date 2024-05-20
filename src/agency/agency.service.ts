import { Inject, Injectable } from "@nestjs/common";
import { AgencyRepository } from "./agency.repository";

@Injectable()
export class AgencyService {
  constructor(
    @Inject(AgencyRepository)
    private readonly agencyRepository: AgencyRepository,
  ) {}

  async findMany() {
    const agencies = await this.agencyRepository.findMany();
    return {
      agencies,
    };
  }
}
