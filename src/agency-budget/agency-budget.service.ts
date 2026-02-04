import { Injectable } from "@nestjs/common";
import { AgencyBudgetRepository } from "./agency-budget.repository";

@Injectable()
export class AgencyBudgetService {
  constructor(
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
