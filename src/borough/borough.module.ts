import { forwardRef, Module } from "@nestjs/common";
import { BoroughService } from "./borough.service";
import { BoroughController } from "./borough.controller";
import { BoroughRepository } from "./borough.repository";
import { CapitalProjectModule } from "src/capital-project/capital-project.module";

@Module({
  imports: [forwardRef(() => CapitalProjectModule)],
  exports: [BoroughService, BoroughRepository],
  providers: [BoroughService, BoroughRepository],
  controllers: [BoroughController],
})
export class BoroughModule {}
