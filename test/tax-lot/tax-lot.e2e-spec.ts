import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TaxLotModule } from "src/tax-lot/tax-lot.module";
import { TaxLotRepository } from "src/tax-lot/tax-lot.repository";
import { StorageConfig } from "src/config";

import { getTaxLotGeoJsonByBblQueryResponseSchema } from "src/gen";
import { TaxLotRepositoryMock } from "./tax-lot.repository.mock";
import { InvalidRequestParameterException } from "src/exception";
import { HttpName } from "src/filter";

describe("TaxLots", () => {
  let app: INestApplication;

  const taxLotRepository = new TaxLotRepositoryMock();

  const storageConfig = {};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TaxLotModule],
    })
      .overrideProvider(TaxLotRepository)
      .useValue(taxLotRepository)
      .overrideProvider(StorageConfig)
      .useValue(storageConfig)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("getTaxLotGeoJsonByBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.findByBblSpatialMocks[0];
      const { bbl } = mock;

      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${bbl}/geojson`)
        .expect(200);
      expect(
        getTaxLotGeoJsonByBblQueryResponseSchema.safeParse(response.body)
          .success,
      ).toBe(true);
    });

    it("should 400 when finding by too short bbl", async () => {
      const shortBbl = "012345678";
      const expectedMessage = new InvalidRequestParameterException().message;
      const expectError = HttpName.BAD_REQUEST;
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${shortBbl}/geojson`)
        .expect(400);
      expect(response.body.message).toBe(expectedMessage);
      expect(response.body.error).toBe(expectError);
    });

    it("should 400 when finding by lettered bbl", async () => {
      const letterBbl = "012345678Y";
      const expectedMessage = new InvalidRequestParameterException().message;
      const expectError = HttpName.BAD_REQUEST;
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${letterBbl}/geojson`)
        .expect(400);
      expect(response.body.message).toBe(expectedMessage);
      expect(response.body.error).toBe(expectError);
    });

    it("should 404 when finding by missing bbl", async () => {
      const missingBbl = "0123456789";
      const expectedMessage = HttpName.NOT_FOUND;
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${missingBbl}/geojson`)
        .expect(404);
      expect(response.body.message).toBe(expectedMessage);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
