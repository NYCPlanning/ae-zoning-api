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
  getTaxLotGeoJsonByBblPathParamsSchema,
  GetTaxLotGeoJsonByBblPathParams,
  GetTaxLotByBblPathParams,
  GetZoningDistrictsByTaxLotBblPathParams,
  getZoningDistrictsByTaxLotBblPathParamsSchema,
  getZoningDistrictClassesByTaxLotBblPathParamsSchema,
  GetZoningDistrictClassesByTaxLotBblPathParams,
} from "../gen";
import { Point } from "geojson";

@Injectable()
@Controller("tax-lots")
export class TaxLotController {
  constructor(
    private readonly taxLotService: TaxLotService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get()
  async findAllTaxLots(
    @Query()
    query: {
      afterBbl?: string;
      limit?: number;
      feature: string;
      buffer: number;
    },
  ) {
    const { afterBbl, limit, feature, buffer } = query;
    console.log("feature", feature);
    // Limitation of this POC. It treats the limit as a number. However, it never explicitly converts it to a number. In the production version, we will need to use zod to parse it into a number
    // http://localhost:3000/api/tax-lots?feature={%22type%22:%22Point%22,%22coordinates%22:[-74.01082033320586,40.70849589282993]}
    return this.taxLotService.findAllTaxLots({
      afterBbl,
      limit,
      feature: JSON.parse(feature) as Point,
      buffer,
    });
  }

  @Get("/:bbl")
  @UsePipes(new ZodValidationPipe(getTaxLotByBblPathParamsSchema))
  async findDetailsByBbl(@Param() params: GetTaxLotByBblPathParams) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  @Get("/:bbl/geojson")
  @UsePipes(new ZodValidationPipe(getTaxLotGeoJsonByBblPathParamsSchema))
  async findTaxLotByBblGeoJson(
    @Param() params: GetTaxLotGeoJsonByBblPathParams,
  ) {
    return this.taxLotService.findTaxLotByBblGeoJson(params.bbl);
  }

  @Get("/:bbl/zoning-districts")
  @UsePipes(
    new ZodValidationPipe(getZoningDistrictsByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictByTaxLotBbl(
    @Param() params: GetZoningDistrictsByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictByTaxLotBbl(params.bbl);
  }

  @Get("/:bbl/zoning-districts/classes")
  @UsePipes(
    new ZodValidationPipe(getZoningDistrictClassesByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictClassByTaxLotBbl(
    @Param() params: GetZoningDistrictClassesByTaxLotBblPathParams,
  ) {
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
