import {
    Controller,
    Get,
    Param,
    Res,
    UseFilters,
    UsePipes,
  } from "@nestjs/common";
  import { Response } from "express";
import { CommunityDistrictService } from "./community-district.service"
import { InternalServerErrorExceptionFilter } from "src/filter";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { FindCommunityDistrictTilesPathParams, findCommunityDistrictTilesPathParamsSchema } from "../gen";

@UseFilters(InternalServerErrorExceptionFilter)
@Controller("community-districts")
export class CommunityDistrictController {
  constructor(
    private readonly communityDistrictService: CommunityDistrictService,
  ) {}

  @Get("/:z/:x/:y.pbf")
  @UsePipes(new ZodValidationPipe(findCommunityDistrictTilesPathParamsSchema))
  async findTiles(
    @Param() params: FindCommunityDistrictTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.communityDistrictService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }
}