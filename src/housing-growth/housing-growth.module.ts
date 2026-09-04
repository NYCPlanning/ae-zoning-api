import { forwardRef, Module } from "@nestjs/common";
import { HousingGrowthService } from "./housing-growth.service";
import { HousingGrowthController } from "./housing-growth.controller";
import { HousingGrowthRepository } from "./housing-growth.repository";
// import { CapitalProjectModule } from "src/capital-project/capital-project.module";

@Module({
  // imports: [forwardRef(() => CapitalProjectModule)],
  exports: [HousingGrowthService, HousingGrowthRepository],
  providers: [HousingGrowthService, HousingGrowthRepository],
  controllers: [HousingGrowthController],
})
export class HousingGrowthModule {}
