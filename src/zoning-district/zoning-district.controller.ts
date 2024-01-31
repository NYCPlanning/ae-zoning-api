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
  FindZoningDistrictByZoningDistrictIdPathParams,
  FindZoningDistrictClassesByZoningDistrictIdPathParams,
  findZoningDistrictByZoningDistrictIdPathParamsSchema,
  findZoningDistrictClassesByZoningDistrictIdPathParamsSchema,
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
  @UsePipes(
    new ZodValidationPipe(findZoningDistrictByZoningDistrictIdPathParamsSchema),
  )
  async findById(
    @Param() params: FindZoningDistrictByZoningDistrictIdPathParams,
  ) {
    return this.zoningDistrictService.findById(params.id);
  }

  @Get("/:id/classes")
  @UsePipes(
    new ZodValidationPipe(
      findZoningDistrictClassesByZoningDistrictIdPathParamsSchema,
    ),
  )
  async findZoningDistrictClassesById(
    @Param() params: FindZoningDistrictClassesByZoningDistrictIdPathParams,
  ) {
    return this.zoningDistrictService.findZoningDistrictClassesById(params.id);
  }

  @Get("/:z/:x/:y.pbf")
  @Redirect()
  async findTilesets(@Param() params: { z: number; x: number; y: number }) {
    return await this.zoningDistrictService.findZoningDistrictTilesets(params);
  }
}
