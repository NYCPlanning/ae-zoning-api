import {
  Controller,
  Get,
  Param,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { CityCouncilDistrictService } from "./city-council-district.service";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
} from "src/filter";
import {
  FindCityCouncilDistrictTilesPathParams,
  findCityCouncilDistrictTilesPathParamsSchema,
} from "src/gen";
import { Response } from "express";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";

@UseFilters(BadRequestExceptionFilter, InternalServerErrorExceptionFilter)
@Controller("city-council-districts")
export class CityCouncilDistrictController {
  constructor(
    private readonly cityCouncilDistrictService: CityCouncilDistrictService,
  ) {}

  @Get()
  async findMany() {
    return this.cityCouncilDistrictService.findMany();
  }

  @UsePipes(new ZodTransformPipe(findCityCouncilDistrictTilesPathParamsSchema))
  @Get("/:z/:x/:y.pbf")
  async findTiles(
    @Param() params: FindCityCouncilDistrictTilesPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.cityCouncilDistrictService.findTiles(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }
}
