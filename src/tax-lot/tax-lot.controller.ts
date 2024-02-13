import {
  Controller,
  Get,
  Injectable,
  Param,
  Query,
  Redirect,
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
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { InvalidRequestParameterException } from "src/exception";

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
  @UsePipes(new ZodValidationPipe(findTaxLotsQueryParamsSchema))
  async findMany(@Query() query: FindTaxLotsQueryParams) {
    const { limit: rawLimit, offset: rawOffset } = query;

    let limit: number | undefined;
    if (rawLimit !== undefined) {
      limit = parseInt(rawLimit);
      if (limit < 1 || limit > 100)
        throw new InvalidRequestParameterException();
    } else {
      limit = undefined;
    }

    const offset = rawOffset !== undefined ? parseInt(rawOffset) : undefined;

    return await this.taxLotService.findMany({ limit, offset });
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

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  async findTilesets(@Param() params: { z: number; x: number; y: number }) {
    return await this.taxLotService.findTilesets(params);
  }
}
