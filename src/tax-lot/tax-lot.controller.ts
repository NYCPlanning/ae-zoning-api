import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Redirect,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TaxLotService } from "./tax-lot.service";
import { StorageConfig } from "src/config";

@Injectable()
@Controller("tax-lots")
export class TaxLotController {
  constructor(
    private readonly taxLotService: TaxLotService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get("/:bbl")
  async findDetailsByBbl(@Param() params: { bbl: string }) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  @Get("/:bbl/geojson")
  async findTaxLotByBblGeoJson(@Param() params: { bbl: string }) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  findTaxLotTilesets(@Param() params: { z: number; x: number; y: number }) {
    return {
      url: `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`,
    };
  }
}
