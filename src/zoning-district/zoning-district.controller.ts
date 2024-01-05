import {
  Controller,
  Get,
  Header,
  Inject,
  Injectable,
  Param,
  Res,
  StreamableFile,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ZoningDistrictService } from "./zoning-district.service";
import { StorageConfig } from "src/config";
import { HttpService } from "@nestjs/axios";
import { createReadStream } from "fs";
import { Response } from "express";

@Injectable()
@Controller("zoning-districts")
export class ZoningDistrictController {
  constructor(
    private readonly httpService: HttpService,
    private readonly zoningDistrictService: ZoningDistrictService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get("/:uuid")
  async findZoningDistrictByUuid(@Param() params: { uuid: string }) {
    return this.zoningDistrictService.findZoningDistrictByUuid(params.uuid);
  }

  @Get("/:uuid/classes")
  async findClassesByZoningDistrictUuid(@Param() params: { uuid: string }) {
    return this.zoningDistrictService.findClassesByZoningDistrictUuid(
      params.uuid,
    );
  }

  @Get("/:z/:x/:y.pbf")
  @Header("Content-Type", "application/x-protobuf")
  async findZoningDistrictTilesets(
    @Param() params: { z: number; x: number; y: number },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.info("get result");
    const result = await this.httpService.axiosRef.get(
      `${this.storageConfig.storageUrl}/tilesets/zoning_district/${params.z}/${params.x}/${params.y}.pbf`,
    );
    // console.info("the result is:", result);
    res.send(result.data);
    // return result.data;
  }
}
