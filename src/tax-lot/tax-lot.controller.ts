import {
  Controller,
  Get,
  // Inject,
  Injectable,
  Param,
  // Redirect,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
// import { ConfigType } from "@nestjs/config";
import { TaxLotService } from "./tax-lot.service";
// import { StorageConfig } from "src/config";
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
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("tax-lots")
export class TaxLotController {
  constructor(
    private readonly taxLotService: TaxLotService,
    // @Inject(StorageConfig.KEY)
    // private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

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

  // @Get("/:z/:x/:y.pbf")
  // @Redirect()
  // findTaxLotTilesets(@Param() params: { z: number; x: number; y: number }) {
  //   return {
  //     url: `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`,
  //   };
  // }
}
