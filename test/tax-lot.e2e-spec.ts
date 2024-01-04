import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
// import { DataRetrievalException } from "src/exception";
import { TaxLotModule } from "src/tax-lot/tax-lot.module";
import { TaxLotRepository } from "src/tax-lot/tax-lot.repository";
import { TaxLotService } from "src/tax-lot/tax-lot.service";
import { StorageConfig } from "src/config";

describe("TaxLots", () => {
  let app: INestApplication;
  const taxLotRepository = { findByBbl: () => ({ bbl: "test" }) };
  const taxLotService = { findTaxLotByBbl: (bbl: string) => ({ bbl }) };
  const storageConfig = {};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TaxLotModule],
    })
      .overrideProvider(TaxLotService)
      .useValue(taxLotService)
      .overrideProvider(TaxLotRepository)
      .useValue(taxLotRepository)
      .overrideProvider(StorageConfig)
      .useValue(storageConfig)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it("/GET tax-lots", () => {
    return request(app.getHttpServer())
      .get("/tax-lots/0123456789")
      .expect(200)
      .expect({
        bbl: "0123456789",
      });
  });

  // it("/GET boroughs exception", () => {
  //   jest.spyOn(boroughRepo, "findAll").mockImplementationOnce(() => {
  //     throw new DataRetrievalException();
  //   });
  //   return request(app.getHttpServer()).get("/boroughs").expect(500);
  // });

  afterAll(async () => {
    await app.close();
  });
});
