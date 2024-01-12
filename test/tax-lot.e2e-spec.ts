import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TaxLotModule } from "src/tax-lot/tax-lot.module";
import { TaxLotRepository } from "src/tax-lot/tax-lot.repository";
import { StorageConfig } from "src/config";
import { generateMock } from "@anatine/zod-mock";
import { findByBblSpatialSchema } from "src/schema/tax-lot";
import { getTaxLotGeoJsonByBblQueryResponseSchema } from "src/gen";

describe("TaxLots", () => {
  let app: INestApplication;

  const taxLotRepository = {
    findByBblSpatialMocks: Array.from(Array(10), () =>
      generateMock(findByBblSpatialSchema),
    ),

    findByBblSpatial: (bbl: string) => {
      return taxLotRepository.findByBblSpatialMocks.find(
        (row) => row.bbl === bbl,
      );
    },
  };
  const storageConfig = {};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TaxLotModule],
    })
      // .overrideProvider(TaxLotService)
      // .useValue(taxLotService)
      .overrideProvider(TaxLotRepository)
      .useValue(taxLotRepository)
      .overrideProvider(StorageConfig)
      .useValue(storageConfig)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it("/GET tax-lot 400 error", () => {
    return request(app.getHttpServer())
      .get("/tax-lots/012345678Y")
      .expect(400)
      .expect({
        statusCode: 400,
        message: "Invalid data type or format for request parameter",
        error: "Bad Request",
      });
  });

  it("/GET tax-lot geojson by bbl", async () => {
    const mock = taxLotRepository.findByBblSpatialMocks[0];
    const { bbl } = mock;

    const response = await request(app.getHttpServer())
      .get(`/tax-lots/${bbl}/geojson`)
      .expect(200);
    expect(
      getTaxLotGeoJsonByBblQueryResponseSchema.safeParse(response.body).success,
    ).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
