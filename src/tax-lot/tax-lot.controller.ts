import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Redirect,
  Res,
  UseFilters,
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
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { Response } from "express";

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
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get("/fills/:z/:x/:y.pbf")
  async findFills(
    @Param() params: { z: string; x: string; y: string },
    @Res() res: Response,
  ) {
    const tile = await this.taxLotService.findFills(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
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

  @Get("/:z/:x/:y")
  @Redirect()
  findTaxLotTilesets(@Param() params: { z: number; x: number; y: number }) {
    return {
      url: `http://localhost:5433/tax_lot/${params.z}/${params.x}/${params.y}`,
    };
  }
}
