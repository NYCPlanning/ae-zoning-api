import {
  Controller,
  Get,
  Header,
  Inject,
  Injectable,
  Param,
  Redirect,
  Res,
  UseFilters,
  UsePipes,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ZoningDistrictService } from "./zoning-district.service";
import { StorageConfig } from "src/config";
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
  constructor(
    private readonly zoningDistrictService: ZoningDistrictService,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  @Get("/fills/:z/:x/:y")
  @Header("Content-Type", "application/x-protobuf")
  async findFillTile(
    @Param() params: { z: number; x: number; y: number },
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findFillTile(params);
    res.send(tile);
  }

  @Get("/labels/:z/:x/:y")
  @Header("Content-Type", "application/x-protobuf")
  async findZoningDistrictLabelTile(
    @Param() params: { z: number; x: number; y: number },
    @Res() res: Response,
  ) {
    const tile =
      await this.zoningDistrictService.findZoningDistrictLabelTile(params);
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

  @Get("/:z/:x/:y")
  @Redirect()
  findZoningDistrictTilesets(
    @Param() params: { z: number; x: number; y: number },
  ) {
    return {
      url: `http://localhost:5433/zoning_district/${params.z}/${params.x}/${params.y}`,
    };
  }
}
