import {
  Controller,
  Get,
  Param,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { Response } from "express";
import { CommunityDistrictService } from "./community-district.service";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
} from "src/filter";
import {
  FindCommunityDistrictTilesPathParams,
  findCommunityDistrictTilesPathParamsSchema,
} from "../gen";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";

@UseFilters(BadRequestExceptionFilter, InternalServerErrorExceptionFilter)
@Controller("community-districts")
export class CommunityDistrictController {
  constructor(
    private readonly communityDistrictService: CommunityDistrictService,
  ) {}

  @UsePipes(new ZodTransformPipe(findCommunityDistrictTilesPathParamsSchema))
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCommunityDistrictTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.communityDistrictService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }
}
