import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Redirect,
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

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  findZoningDistrictTilesets(
    @Param() params: { z: number; x: number; y: number },
  ) {
    return {
      url: `${this.storageConfig.storageUrl}/tilesets/zoning_district/${params.z}/${params.x}/${params.y}.pbf`,
    };
  }
}
