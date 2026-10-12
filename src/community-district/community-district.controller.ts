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
import * as shpwrite from "@mapbox/shp-write";
import { Compression, OutputType } from "@mapbox/shp-write";

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

  @Get("/shapefile")
  async findShapefile(@Res() res: Response) {
    try {
      const geoJSON = await this.communityDistrictService.findShapefile();

      const options = {
        filename: `CPP_Community_Districts_Export_${String(new Date().getDate()).padStart(2, "0")}_${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date().getMonth()]}_${new Date().getFullYear()}.zip`,
        outputType: <OutputType>"nodebuffer",
        compression: <Compression>"STORE",
      };
      const zipData = await shpwrite.zip(geoJSON, options);

      res.set("Content-Type", "application/zip");
      res.set(
        "Content-Disposition",
        `attachment; filename=CPP_Community_Districts_Export_${String(
          new Date().getDate(),
        ).padStart(
          2,
          "0",
        )}_${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][new Date().getMonth()]}_${new Date().getFullYear()}.zip`,
      );
      res.set("Access-Control-Expose-Headers", "Content-Disposition");
      res.send(zipData);
    } catch (e) {
      console.error(e);
    }
  }
}
