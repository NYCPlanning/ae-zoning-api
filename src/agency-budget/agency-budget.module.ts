import { Module } from "@nestjs/common";
import { AgencyBudgetController } from "./agency-budget.controller";
import { AgencyBudgetService } from "./agency-budget.service";
import { AgencyBudgetRepository } from "./agency-budget.repository";

@Module({
  exports: [AgencyBudgetService, AgencyBudgetRepository],
  providers: [AgencyBudgetService, AgencyBudgetRepository],
  controllers: [AgencyBudgetController],
})
export class AgencyBudgetModule {}
