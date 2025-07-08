import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Query,
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
  FindTaxLotsQueryParams,
} from "../gen";
import {
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
} from "src/filter";
import { ZodTransformPipe } from "src/pipes/zod-transform-pipe";
import { unparse } from "papaparse";
import {
  FILE_STORAGE,
  FileStorageService,
} from "src/global/providers/file-storage.provider";

@Injectable()
@UseFilters(
  BadRequestExceptionFilter,
  InternalServerErrorExceptionFilter,
  NotFoundExceptionFilter,
)
@Controller("tax-lots")
export class TaxLotController {
  constructor(
    private readonly taxLotService: TaxLotService,

    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorageService,
  ) {}

  @Get()
  @UsePipes(new ZodTransformPipe(findTaxLotsQueryParamsSchema))
  async findMany(@Query() params: FindTaxLotsQueryParams) {
    return await this.taxLotService.findMany(params);
  }

  @Get("/csv")
  @UsePipes(new ZodTransformPipe(findTaxLotsQueryParamsSchema))
  async findManyCsv(@Query() params: FindTaxLotsQueryParams) {
    const { taxLots } = await this.taxLotService.findMany(params);
    const csvFormat = unparse(taxLots);
    const csv = Buffer.from(csvFormat);

    const bucketName = "test-bucket";
    const exists = await this.fileStorage.bucketExists(bucketName);
    if (exists) {
      console.log("bucket exists", bucketName);
      this.fileStorage.putObject(
        bucketName,
        "tax-lots.csv",
        csv,
        csv.byteLength,
      );
      const data: Array<unknown> = [];
      const objectStream = this.fileStorage.listObjects(bucketName);
      objectStream.on("data", (obj) => data.push(obj));
      objectStream.on("end", () => console.debug("objects", data));
    } else {
      await this.fileStorage.makeBucket(bucketName, "us-east-1");
    }
    const buckets = await this.fileStorage.listBuckets();
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
