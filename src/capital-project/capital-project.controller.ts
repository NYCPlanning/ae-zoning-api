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
  FindCapitalProjectTilesPathParams,
  findCapitalProjectTilesPathParamsSchema,
} from "src/gen";
import { CapitalProjectService } from "./capital-project.service";
import { DecodeParamsPipe } from "src/pipes/decode-params-pipe";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
} from "src/filter";

@UseFilters(BadRequestExceptionFilter, InternalServerErrorExceptionFilter)
@Controller("capital-projects")
export class CapitalProjectController {
  constructor(private readonly capitalProjectService: CapitalProjectService) {}

  @UsePipes(
    new DecodeParamsPipe(findCapitalProjectTilesPathParamsSchema),
    new ZodValidationPipe(findCapitalProjectTilesPathParamsSchema),
  )
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCapitalProjectTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.capitalProjectService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }
}
