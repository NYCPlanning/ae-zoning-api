import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Query,
  Redirect,
  UsePipes,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { TaxLotService } from "./tax-lot.service";
import { StorageConfig } from "src/config";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  getTaxLotByBblPathParamsSchema,
  GetTaxLotByBblPathParams,
} from "../gen";

@Injectable()
@Controller("tax-lots")
export class TaxLotController {
  constructor(
    private readonly taxLotService: TaxLotService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get()
  async findAllTaxLots(@Query() query: { afterBbl?: string; limit?: number }) {
    // Limitation of this POC. It treats the limit as a number. However, it never explicitly converts it to a number. In the production version, we will need to use zod to parse it into a number
    return this.taxLotService.findAllTaxLots(query);
  }

  @Get("/:bbl")
  @UsePipes(new ZodValidationPipe(getTaxLotByBblPathParamsSchema))
  async findDetailsByBbl(@Param() params: GetTaxLotByBblPathParams) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  @Get("/:bbl/geojson")
  async findTaxLotByBblGeoJson(@Param() params: { bbl: string }) {
    return this.taxLotService.findTaxLotByBblGeoJson(params.bbl);
  }

  @Get("/:bbl/zoning-districts")
  async findZoningDistrictByTaxLotBbl(@Param() params: { bbl: string }) {
    return this.taxLotService.findZoningDistrictByTaxLotBbl(params.bbl);
  }

  @Get("/:bbl/zoning-districts/classes")
  async findZoningDistrictClassByTaxLotBbl(@Param() params: { bbl: string }) {
    return this.taxLotService.findZoningDistrictClassByTaxLotBbl(params.bbl);
  }

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  findTaxLotTilesets(@Param() params: { z: number; x: number; y: number }) {
    return {
      url: `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`,
    };
  }
}
