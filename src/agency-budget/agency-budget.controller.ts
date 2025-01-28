import { Controller, Get } from "@nestjs/common";
import { AgencyBudgetService } from "./agency-budget.service";

@Controller("agency-budgets")
export class AgencyBudgetController {
  constructor(private readonly agencyBudgetService: AgencyBudgetService) {}

  @Get()
  async findMany() {
    return await this.agencyBudgetService.findMany();
  }
}
