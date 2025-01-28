import { Controller, Get, UseFilters } from "@nestjs/common";
import { AgencyBudgetService } from "./agency-budget.service";
import { InternalServerErrorExceptionFilter } from "src/filter";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("agency-budgets")
export class AgencyBudgetController {
  constructor(private readonly agencyBudgetService: AgencyBudgetService) {}

  @Get()
  async findMany() {
    return await this.agencyBudgetService.findMany();
  }
}
