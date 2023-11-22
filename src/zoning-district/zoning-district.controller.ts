import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Redirect,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ZoningDistrictService } from "./zoning-district.service";
import { StorageConfig } from "src/config";

@Injectable()
@Controller("zoning-districts")
export class ZoningDistrictController {
  constructor(
    private readonly zoningDistrictService: ZoningDistrictService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get("/:id")
  async findById(@Param() params: { id: string }) {
    return this.zoningDistrictService.findById(params.id);
  }

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  findZoningDistrictTilesets(
    @Param() params: { z: number; x: number; y: number },
  ) {
    return {
      url: `${this.storageConfig.storageUrl}/tilesets/zoning_district/${params.z}/${params.x}/${params.y}.pbf`,
    };
  }
}
