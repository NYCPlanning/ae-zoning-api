import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TaxLotModule } from "src/tax-lot/tax-lot.module";
import { TaxLotRepository } from "src/tax-lot/tax-lot.repository";
import {
  getTaxLotByBblQueryResponseSchema,
  getTaxLotGeoJsonByBblQueryResponseSchema,
  getZoningDistrictClassesByTaxLotBblQueryResponseSchema,
  getZoningDistrictsByTaxLotBblQueryResponseSchema,
} from "src/gen";
import { TaxLotRepositoryMock } from "./tax-lot.repository.mock";
import {
  DataRetrievalException,
  InvalidRequestParameterException,
} from "src/exception";
import { HttpName } from "src/filter";

describe("TaxLots", () => {
  let app: INestApplication;

  const taxLotRepository = new TaxLotRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TaxLotModule],
    })
      .overrideProvider(TaxLotRepository)
      .useValue(taxLotRepository)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("getTaxLotByBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.findByBblMocks[0];

      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}`)
        .expect(200);
      expect(() =>
        getTaxLotByBblQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 400 when finding by too short bbl", async () => {
      const shortBbl = "012345678";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${shortBbl}`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by lettered bbl", async () => {
      const letterBbl = "012345678Y";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${letterBbl}`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing bbl", async () => {
      const missingBbl = "0123456789";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${missingBbl}`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest.spyOn(taxLotRepository, "findByBbl").mockImplementationOnce(() => {
        throw dataRetrievalException;
      });
      const mock = taxLotRepository.findByBblMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("getTaxLotGeoJsonByBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.findByBblSpatialMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/geojson`)
        .expect(200);
      expect(() =>
        getTaxLotGeoJsonByBblQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 400 when finding by too short bbl", async () => {
      const shortBbl = "012345678";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${shortBbl}/geojson`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by lettered bbl", async () => {
      const letterBbl = "012345678Y";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${letterBbl}/geojson`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing bbl", async () => {
      const missingBbl = "0123456789";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${missingBbl}/geojson`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(taxLotRepository, "findByBblSpatial")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock = taxLotRepository.findByBblSpatialMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/geojson`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findZoningDistrictByTaxLotBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.checkTaxLotByBblMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts`)
        .expect(200);
      expect(() =>
        getZoningDistrictsByTaxLotBblQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 400 when finding by too short bbl", async () => {
      const shortBbl = "012345678";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${shortBbl}/zoning-districts`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by lettered bbl", async () => {
      const letterBbl = "012345678Y";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${letterBbl}/zoning-districts`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });
    it("should 404 when finding by missing bbl", async () => {
      const missingBbl = "0123456789";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${missingBbl}/zoning-districts`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(taxLotRepository, "findZoningDistrictByBbl")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock = taxLotRepository.checkTaxLotByBblMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findZoningDistrictClassByTaxLotBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.checkTaxLotByBblMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts/classes`)
        .expect(200);
      expect(() =>
        getZoningDistrictClassesByTaxLotBblQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by too short bbl", async () => {
      const shortBbl = "012345678";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${shortBbl}/zoning-districts/classes`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by lettered bbl", async () => {
      const letterBbl = "012345678Y";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${letterBbl}/zoning-districts/classes`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing bbl", async () => {
      const missingBbl = "0123456789";
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${missingBbl}/zoning-districts/classes`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(taxLotRepository, "findZoningDistrictClassByBbl")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock = taxLotRepository.checkTaxLotByBblMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts/classes`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
