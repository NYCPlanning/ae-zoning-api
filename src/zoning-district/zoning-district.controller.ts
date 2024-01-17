import {
  Controller,
  Get,
  Injectable,
  Param,
  Redirect,
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

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("zoning-districts")
export class ZoningDistrictController {
  constructor(private readonly zoningDistrictService: ZoningDistrictService) {}

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
  async findZoningDistrictTilesets(
    @Param() params: { z: number; x: number; y: number },
  ) {
    return await this.zoningDistrictService.findZoningDistrictTilesets(params);
  }
}
