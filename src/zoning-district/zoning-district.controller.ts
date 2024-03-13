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
  FindZoningDistrictByZoningDistrictIdPathParams,
  FindZoningDistrictClassesByZoningDistrictIdPathParams,
  findZoningDistrictByZoningDistrictIdPathParamsSchema,
  findZoningDistrictClassesByZoningDistrictIdPathParamsSchema,
  FindZoningDistrictFillsPathParams,
  FindZoningDistrictLabelsPathParams,
  findZoningDistrictFillsPathParamsSchema,
  findZoningDistrictLabelsPathParamsSchema,
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
  @UsePipes(new ZodValidationPipe(findZoningDistrictFillsPathParamsSchema))
  async findFills(
    @Param() params: FindZoningDistrictFillsPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findFills(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

  @Get("/labels/:z/:x/:y.pbf")
  @UsePipes(new ZodValidationPipe(findZoningDistrictLabelsPathParamsSchema))
  async findLabels(
    @Param() params: FindZoningDistrictLabelsPathParams,
    @Res() res: Response,
  ) {
    const tile = await this.zoningDistrictService.findLabels(params);
    res.set("Content-Type", "application/x-protobuf");
    res.send(tile);
  }

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
}
