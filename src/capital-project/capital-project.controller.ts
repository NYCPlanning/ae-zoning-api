import {
  Controller,
  Get,
  Param,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { Response } from "express";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectTilesPathParams,
  findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema,
  findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema,
  findCapitalProjectTilesPathParamsSchema,
} from "src/gen";
import { CapitalProjectService } from "./capital-project.service";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("capital-projects")
export class CapitalProjectController {
  constructor(private readonly capitalProjectService: CapitalProjectService) {}

  @UsePipes(
    new ZodTransformPipe(
      findCapitalProjectByManagingCodeCapitalProjectIdPathParamsSchema,
    ),
  )
  @Get("/:managingCode/:capitalProjectId")
  async findByManagingCodeCapitalProjectId(
    @Param() params: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  ) {
    return await this.capitalProjectService.findByManagingCodeCapitalProjectId(
      params,
    );
  }

  @UsePipes(new ZodTransformPipe(findCapitalProjectTilesPathParamsSchema))
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCapitalProjectTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.capitalProjectService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @UsePipes(
    new ZodTransformPipe(
      findCapitalCommitmentsByManagingCodeCapitalProjectIdPathParamsSchema,
    ),
  )
  @Get("/:managingCode/:capitalProjectId/capital-commitments")
  async findCapitalCommitmentsByManagingCodeCapitalProjectId(
    @Param()
    params: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  ) {
    return await this.capitalProjectService.findCapitalCommitmentsByManagingCodeCapitalProjectId(
      params,
    );
  }
}
