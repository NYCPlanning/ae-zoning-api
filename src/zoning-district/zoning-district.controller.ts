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
  getZoningDistrictByIdPathParamsSchema,
  getZoningDistrictClassesByUuidPathParamsSchema,
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

  @Get("/fills/:z/:x/:y")
  async findFillTile(
    @Param() params: { z: number; x: number; y: number },
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findFillTile(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/labels/:z/:x/:y")
  async findLabelTile(
    @Param() params: { z: number; x: number; y: number },
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findLabelTile(params);
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
