import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  findTaxLotByBblPathParamsSchema,
  findTaxLotGeoJsonByBblPathParamsSchema,
  FindTaxLotGeoJsonByBblPathParams,
  FindTaxLotByBblPathParams,
  FindZoningDistrictsByTaxLotBblPathParams,
  findZoningDistrictsByTaxLotBblPathParamsSchema,
  findZoningDistrictClassesByTaxLotBblPathParamsSchema,
  FindZoningDistrictClassesByTaxLotBblPathParams,
  findTaxLotsQueryParamsSchema,
  FindTaxLotsQueryParams,
  findTaxLotFillsPathParamsSchema,
  FindTaxLotFillsPathParams,
  findTaxLotLabelsPathParamsSchema,
  FindTaxLotLabelsPathParams,
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { DecodeParamsPipe } from "src/pipes/decode-params-pipe";
import { Response } from "express";

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("tax-lots")
export class TaxLotController {
  constructor(private readonly taxLotService: TaxLotService) {}

  @Get()
  @UsePipes(
    new DecodeParamsPipe(findTaxLotsQueryParamsSchema),
    new ZodValidationPipe(findTaxLotsQueryParamsSchema),
  )
  async findMany(
    @Query()
    params: FindTaxLotsQueryParams,
  ) {
    return await this.taxLotService.findMany(params);
  }
  @Get("/fills/:z/:x/:y.pbf")
  @UsePipes(new ZodValidationPipe(findTaxLotFillsPathParamsSchema))
  async findFills(
    @Param() params: FindTaxLotFillsPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.taxLotService.findFills(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/labels/:z/:x/:y.pbf")
  @UsePipes(new ZodValidationPipe(findTaxLotLabelsPathParamsSchema))
  async findLabels(
    @Param() params: FindTaxLotLabelsPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.taxLotService.findLabels(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/:bbl")
  @UsePipes(new ZodValidationPipe(findTaxLotByBblPathParamsSchema))
  async findDetailsByBbl(@Param() params: FindTaxLotByBblPathParams) {
    return this.taxLotService.findByBbl(params.bbl);
  }

  @Get("/:bbl/geojson")
  @UsePipes(new ZodValidationPipe(findTaxLotGeoJsonByBblPathParamsSchema))
  async findBblByGeoJson(@Param() params: FindTaxLotGeoJsonByBblPathParams) {
    return this.taxLotService.findGeoJsonByBbl(params.bbl);
  }

  @Get("/:bbl/zoning-districts")
  @UsePipes(
    new ZodValidationPipe(findZoningDistrictsByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictsByBbl(
    @Param() params: FindZoningDistrictsByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictsByBbl(params.bbl);
  }

  @Get("/:bbl/zoning-districts/classes")
  @UsePipes(
    new ZodValidationPipe(findZoningDistrictClassesByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictClassesByBbl(
    @Param() params: FindZoningDistrictClassesByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictClassesByBbl(params.bbl);
  }
}
