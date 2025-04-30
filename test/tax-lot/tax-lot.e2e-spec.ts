import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TaxLotModule } from "src/tax-lot/tax-lot.module";
import { TaxLotRepository } from "src/tax-lot/tax-lot.repository";
import {
  findTaxLotByBblQueryResponseSchema,
  findTaxLotGeoJsonByBblQueryResponseSchema,
  findZoningDistrictClassesByTaxLotBblQueryResponseSchema,
  findZoningDistrictsByTaxLotBblQueryResponseSchema,
  findTaxLotsQueryResponseSchema,
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

  describe("findTaxLots", () => {
    it("should 200 and return a list of tax lots with page metadata", async () => {
      const response = await request(app.getHttpServer())
        .get("/tax-lots")
        .expect(200);
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findTaxLotsQueryResponseSchema.parse(response.body);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
    });

    it("should 200 and return tax lots with page metadata when specifying offset and limit", async () => {
      const limit = 5;
      const offset = 2;
      const response = await request(app.getHttpServer()).get(
        `/tax-lots?limit=${limit}&offset=${offset}`,
      );

      expect(() =>
        findTaxLotsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findTaxLotsQueryResponseSchema.parse(response.body);
      expect(parsedBody.limit).toBe(limit);
      expect(parsedBody.offset).toBe(offset);
    });

    it("should 200 and return tax lots with page metadata when passing a spatial filter", async () => {
      const response = await request(app.getHttpServer())
        .get("/tax-lots?geometry=LineString&lons=0,1&lats=0,1")
        .expect(200);
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findTaxLotsQueryResponseSchema.parse(response.body);
      expect(parsedBody.total).toBe(2);
    });

    it.only("should 200 and return tax lots with page metadata when passing a spatial filter with a serialized array with brackets", async () => {
      const response = await request(app.getHttpServer())
        .get(
          "/tax-lots?geometry=LineString&lons[]=-74.010776&lons[]=-74.010776&lats[]=40.708649&lats[]=40.707800",
        )
        .expect(200);
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
      const parsedBody = findTaxLotsQueryResponseSchema.parse(response.body);
      expect(parsedBody.total).toBe(2);
    });

    it("should 400 when formatting a numeric parameter as an array", async () => {
      const response = await request(app.getHttpServer()).get(
        "/tax-lots?limit=[4]",
      );
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by an invalid limit", async () => {
      const response = await request(app.getHttpServer()).get(
        "/tax-lots?limit=b4d",
      );
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a 'too-high' limit", async () => {
      const response = await request(app.getHttpServer()).get(
        "/tax-lots?limit=101",
      );
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a 'too-low' limit", async () => {
      const response = await request(app.getHttpServer()).get(
        "/tax-lots?limit=0",
      );
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by invalid offset", async () => {
      const response = await request(app.getHttpServer()).get(
        "/tax-lots?offset=b4d",
      );
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when requesting an invalid geometry", async () => {
      const response = await request(app.getHttpServer())
        .get("/tax-lots?geometry=linestring&lons=0,1&lats=0,1")
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when requesting a coordinate with too many points", async () => {
      const response = await request(app.getHttpServer())
        .get("/tax-lots?geometry=LineString&lons=0,1,2,3,4,5&lats=0,1,2,3,4,5")
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when requesting a coordinate with invalid points", async () => {
      const response = await request(app.getHttpServer())
        .get("/tax-lots?geometry=LineString&lons=DROPTables&lats=DROPDatabase")
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when requesting an invalid buffer", async () => {
      const response = await request(app.getHttpServer())
        .get(
          "/tax-lots?geometry=LineString&lons=0,1,2,3,4&lats=0,1,2,3,4&buffer=b4d",
        )
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when requesting a spatial filter with incomplete parameters", async () => {
      const response = await request(app.getHttpServer())
        .get("/tax-lots?geometry=LineString&lons=0,1,2,3,4")
        .expect(400);

      expect(response.body.message).toContain(
        "spatial filter: missing required",
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a database error", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest.spyOn(taxLotRepository, "findMany").mockImplementationOnce(() => {
        throw dataRetrievalException;
      });
      const response = await request(app.getHttpServer())
        .get("/tax-lots")
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("getTaxLotByBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.lots[0];

      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}`)
        .expect(200);
      expect(() =>
        findTaxLotByBblQueryResponseSchema.parse(response.body),
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
      const mock = taxLotRepository.lots[0];
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
        findTaxLotGeoJsonByBblQueryResponseSchema.parse(response.body),
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
      const mock = taxLotRepository.lots[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts`)
        .expect(200);
      expect(() =>
        findZoningDistrictsByTaxLotBblQueryResponseSchema.parse(response.body),
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
        .spyOn(taxLotRepository, "findZoningDistrictsByBbl")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock = taxLotRepository.lots[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findZoningDistrictClassByTaxLotBbl", () => {
    it("should 200 and return documented schema when finding by valid bbl", async () => {
      const mock = taxLotRepository.lots[0];
      const response = await request(app.getHttpServer())
        .get(`/tax-lots/${mock.bbl}/zoning-districts/classes`)
        .expect(200);
      expect(() =>
        findZoningDistrictClassesByTaxLotBblQueryResponseSchema.parse(
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
        .spyOn(taxLotRepository, "findZoningDistrictClassesByBbl")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock = taxLotRepository.lots[0];
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
