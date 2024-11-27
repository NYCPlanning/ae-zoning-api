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
  findTaxLotBlockIdsByBoroughIdPathParamsSchema,
  FindTaxLotBlockIdsByBoroughIdPathParams,
  findTaxLotBlockIdsByBoroughIdQueryParamsSchema,
  FindTaxLotBlockIdsByBoroughIdQueryParams,
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";

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
  @UsePipes(new ZodTransformPipe(findTaxLotsQueryParamsSchema))
  async findMany(
    @Query()
    params: FindTaxLotsQueryParams,
  ) {
    return await this.taxLotService.findMany(params);
  }

  @Get("/:boroughId")
  async findBlockIdsByBoroughId(
    @Param(new ZodTransformPipe(findTaxLotBlockIdsByBoroughIdPathParamsSchema))
    pathParams: FindTaxLotBlockIdsByBoroughIdPathParams,
    @Query(new ZodTransformPipe(findTaxLotBlockIdsByBoroughIdQueryParamsSchema))
    queryParams: FindTaxLotBlockIdsByBoroughIdQueryParams,
  ) {
    return await this.taxLotService.findBlockIdsByBoroughId({
      ...pathParams,
      ...queryParams,
    });
  }

  @Get("/:boroughId/:blockId/:lotId")
  @UsePipes(new ZodTransformPipe(findTaxLotByBblPathParamsSchema))
  async findDetailsByBbl(@Param() params: FindTaxLotByBblPathParams) {
    return this.taxLotService.findByBbl(params);
  }

  @Get("/:boroughId/:blockId/:lotId/geojson")
  @UsePipes(new ZodTransformPipe(findTaxLotGeoJsonByBblPathParamsSchema))
  async findBblByGeoJson(@Param() params: FindTaxLotGeoJsonByBblPathParams) {
    return this.taxLotService.findGeoJsonByBbl(params);
  }

  @Get("/:boroughId/:blockId/:lotId/zoning-districts")
  @UsePipes(
    new ZodTransformPipe(findZoningDistrictsByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictsByBbl(
    @Param() params: FindZoningDistrictsByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictsByBbl(params);
  }

  @Get("/:boroughId/:blockId/:lotId/zoning-districts/classes")
  @UsePipes(
    new ZodTransformPipe(findZoningDistrictClassesByTaxLotBblPathParamsSchema),
  )
  async findZoningDistrictClassesByBbl(
    @Param() params: FindZoningDistrictClassesByTaxLotBblPathParams,
  ) {
    return this.taxLotService.findZoningDistrictClassesByBbl(params);
  }

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  async findTilesets(@Param() params: { z: number; x: number; y: number }) {
    return await this.taxLotService.findTilesets(params);
  }
}
