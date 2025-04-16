import {
  Controller,
  Get,
  Param,
  Redirect,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
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
  @Redirect()
  async findTiles(@Param() params: FindCommunityDistrictTilesPathParams) {
    const { z, x, y } = params;
    return {
      url: `https://pmtiles.planninglabs.nyc/community-districts/${z}/${x}/${y}.mvt`,
    };
  }
}
