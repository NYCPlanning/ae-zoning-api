import { Module } from "@nestjs/common";
import { CapitalProjectController } from "./capital-project.controller";
import { CapitalProjectService } from "./capital-project.service";
import { CapitalProjectRepository } from "./capital-project.repository";

@Module({
  exports: [CapitalProjectService],
  providers: [CapitalProjectService, CapitalProjectRepository],
  controllers: [CapitalProjectController],
})
export class CapitalProjectModule {}
