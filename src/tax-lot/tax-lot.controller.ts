import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Put,
  Query,
  Redirect,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";
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
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import {
  FILE_STORAGE,
  FileStorageService,
} from "src/global/providers/file-storage.provider";

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

    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorageService,
  ) {}

  @Get()
  @UsePipes(new ZodTransformPipe(findTaxLotsQueryParamsSchema))
  async findMany(@Query() params: FindTaxLotsQueryParams) {
    return await this.taxLotService.findMany(params);
  }

  @Put("/csv")
  async replaceCsv(
    @Body()
    body: {
      geometry?: "Point" | "LineString" | "Polygon";
      lats?: Array<number>;
      lons?: Array<number>;
      buffer?: number;
    },
  ) {
    const taxLots = await this.taxLotService.findCsv(body);
    const fileName = this.fileStorage.getFileName("tax-lots", body, ".csv");
    return await this.fileStorage.replaceFile(fileName, taxLots);
  }

  @Get("/csv")
  @UsePipes(new ZodTransformPipe(findTaxLotsQueryParamsSchema))
  async findManyCsv(@Query() params: FindTaxLotsQueryParams) {
    const fileName = this.fileStorage.getFileName("tax-lots", params, ".csv");

    return await this.fileStorage.getFileUrl(fileName);
  }

  @Get("/:bbl")
  @UsePipes(new ZodTransformPipe(findTaxLotByBblPathParamsSchema))
  async findDetailsByBbl(@Param() params: FindTaxLotByBblPathParams) {
    return this.taxLotService.findByBbl(params.bbl);
  }

  @Get("/:bbl/geojson")
  @UsePipes(new ZodTransformPipe(findTaxLotGeoJsonByBblPathParamsSchema))
  async findBblByGeoJson(@Param() params: FindTaxLotGeoJsonByBblPathParams) {
    return this.taxLotService.findGeoJsonByBbl(params.bbl);
  }

  @Get("/:bbl/zoning-districts")
  @UsePipes(
    new ZodTransformPipe(findZoningDistrictsByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictsByBbl(
    @Param() params: FindZoningDistrictsByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictsByBbl(params.bbl);
  }

  @Get("/:bbl/zoning-districts/classes")
  @UsePipes(
    new ZodTransformPipe(findZoningDistrictClassesByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictClassesByBbl(
    @Param() params: FindZoningDistrictClassesByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictClassesByBbl(params.bbl);
  }

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  async findTilesets(@Param() params: { z: number; x: number; y: number }) {
    return await this.taxLotService.findTilesets(params);
  }
}
