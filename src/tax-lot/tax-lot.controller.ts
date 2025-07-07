import {
  Controller,
  Get,
  Injectable,
  Param,
  Redirect,
  StreamableFile,
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
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import { unparse } from "papaparse";
import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 4566,
  useSSL: false,
  accessKey: "test",
  secretKey: "test",
});

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
  async findMany() {
    // const { taxLots } = await this.taxLotService.findMany(params);
    const taxLots = [{}];
    const start = performance.now();
    const csvFormat = unparse(taxLots);
    const csv = Buffer.from(csvFormat);
    console.debug("time", performance.now() - start);
    const bucketName = "test-bucket";
    const exists = await minioClient.bucketExists(bucketName);
    if (exists) {
      console.log("bucket exists", bucketName);
    } else {
      await minioClient.makeBucket(bucketName, "us-east-1");
    }
    const buckets = await minioClient.listBuckets();
    console.debug("buckets", buckets);
    return new StreamableFile(csv, {
      type: "text/csv",
      disposition: "attachment; filename=tax-lots.csv",
    });
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
