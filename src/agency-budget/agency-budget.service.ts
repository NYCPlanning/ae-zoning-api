import { Inject } from "@nestjs/common";
import { AgencyBudgetRepository } from "./agency-budget.repository";

export class AgencyBudgetService {
  constructor(
    @Inject(AgencyBudgetRepository)
    private readonly agencyBudgetRepository: AgencyBudgetRepository,
  ) {}

  async findMany() {
    const agencyBudgets = await this.agencyBudgetRepository.findMany();
    return {
      agencyBudgets,
      order: "code",
    };
  }
}
