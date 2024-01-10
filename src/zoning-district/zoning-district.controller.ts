import {
  Controller,
  Get,
  Injectable,
  Param,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import {
  GetZoningDistrictByIdPathParams,
  GetZoningDistrictClassesByUuidPathParams,
  GetZoningDistrictFillsPathParams,
  GetZoningDistrictLabelsPathParams,
  getZoningDistrictByIdPathParamsSchema,
  getZoningDistrictClassesByUuidPathParamsSchema,
  getZoningDistrictFillsPathParamsSchema,
  getZoningDistrictLabelsPathParamsSchema,
} from "src/gen";
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
@Controller("zoning-districts")
export class ZoningDistrictController {
  constructor(private readonly zoningDistrictService: ZoningDistrictService) {}

  @Get("/fills/:z/:x/:y.pbf")
  @UsePipes(new ZodValidationPipe(getZoningDistrictFillsPathParamsSchema))
  async findFills(
    @Param() params: GetZoningDistrictFillsPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findFills(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/labels/:z/:x/:y.pbf")
  @UsePipes(new ZodValidationPipe(getZoningDistrictLabelsPathParamsSchema))
  async findLabels(
    @Param() params: GetZoningDistrictLabelsPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findLabels(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/:id")
  @UsePipes(new ZodValidationPipe(getZoningDistrictByIdPathParamsSchema))
  async findZoningDistrictByUuid(
    @Param() params: GetZoningDistrictByIdPathParams,
  ) {
    return this.zoningDistrictService.findZoningDistrictByUuid(params.id);
  }

  @Get("/:uuid/classes")
  @UsePipes(
    new ZodValidationPipe(getZoningDistrictClassesByUuidPathParamsSchema),
  )
  async findClassesByZoningDistrictUuid(
    @Param() params: GetZoningDistrictClassesByUuidPathParams,
  ) {
    return this.zoningDistrictService.findClassesByZoningDistrictUuid(
      params.uuid,
    );
  }
}
