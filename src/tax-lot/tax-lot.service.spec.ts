import { Test } from "@nestjs/testing";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotRepositoryMock } from "test/tax-lot/tax-lot.repository.mock";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  findTaxLotByBblQueryResponseSchema,
  findTaxLotGeoJsonByBblQueryResponseSchema,
  findTaxLotsQueryResponseSchema,
  findZoningDistrictClassesByTaxLotBblQueryResponseSchema,
  findZoningDistrictsByTaxLotBblQueryResponseSchema,
} from "src/gen";

describe("TaxLotController", () => {
  let taxLotService: TaxLotService;

  const taxLotRepository = new TaxLotRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TaxLotService, TaxLotRepository],
    })
      .overrideProvider(TaxLotRepository)
      .useValue(taxLotRepository)
      .compile();

    taxLotService = moduleRef.get<TaxLotService>(TaxLotService);
  });

  describe("findMany", () => {
    it("should return a list of tax lots, using the default limit and offset", async () => {
      const resource = await taxLotService.findMany({});
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.total).toBe(parsedResource.taxLots.length);
      expect(parsedResource.order).toBe("bbl");
    });

    it("should return a tax lot list, using user specified limit and offset", async () => {
      const limit = 2;
      const offset = 5;
      const taxLots = await taxLotService.findMany({ limit, offset });
      expect(() => findTaxLotsQueryResponseSchema.parse(taxLots)).not.toThrow();
      const parsedTaxLots = findTaxLotsQueryResponseSchema.parse(taxLots);
      expect(parsedTaxLots.limit).toBe(2);
      expect(parsedTaxLots.offset).toBe(5);
      expect(parsedTaxLots.total).toBe(parsedTaxLots.taxLots.length);
      expect(parsedTaxLots.order).toBe("bbl");
    });

    it("should error when requesting an incomplete set of spatial filters", async () => {
      expect(taxLotService.findMany({ buffer: 600 })).rejects.toThrow(
        /missing required parameters/,
      );
    });

    it("should error when requesting a shape with lats and lons of different lengths", async () => {
      expect(
        taxLotService.findMany({
          geometry: "LineString",
          lats: [0, 1],
          lons: [0, 1, 2],
        }),
      ).rejects.toThrow(/latitude and longitude lengths differ/);
    });

    it("should error when requesting a Point with a lon length greater than one", async () => {
      expect(
        taxLotService.findMany({
          geometry: "Point",
          lats: [0, 1],
          lons: [0, 1],
        }),
      ).rejects.toThrow(/more than one coordinate provided for Point/);
    });

    it("should error when requesting a LineString with a lon length less than two", async () => {
      expect(
        taxLotService.findMany({
          geometry: "LineString",
          lats: [0],
          lons: [0],
        }),
      ).rejects.toThrow(/fewer than two coordinates provided for LineString/);
    });

    it("should error when requesting a Polygon with a lon length less than four", async () => {
      expect(
        taxLotService.findMany({
          geometry: "Polygon",
          lats: [0, 1, 2],
          lons: [0, 1, 2],
        }),
      ).rejects.toThrow(/fewer than four coordinates provided for Polygon/);
    });

    it("should return a list of tax lots filtered by a Point", async () => {
      const resource = await taxLotService.findMany({
        geometry: "Point",
        lats: [0],
        lons: [0],
      });
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.total).toBe(2);
      expect(
        parsedResource.taxLots[0].bbl >=
          parsedResource.taxLots[parsedResource.taxLots.length - 1].bbl,
      ).toBe(true);
      expect(parsedResource.order).toBe("distance");
    });

    it("should return a list of tax lots filtered by a Point with a buffer", async () => {
      const resource = await taxLotService.findMany({
        geometry: "Point",
        buffer: 600,
        lats: [0],
        lons: [0],
      });
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.total).toBe(10);
      expect(
        parsedResource.taxLots[0].bbl >=
          parsedResource.taxLots[parsedResource.taxLots.length - 1].bbl,
      ).toBe(true);
      expect(parsedResource.order).toBe("distance");
    });

    it("should return a list of tax lots filtered by a LineString", async () => {
      const resource = await taxLotService.findMany({
        geometry: "LineString",
        lats: [0, 1],
        lons: [0, 1],
      });
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.total).toBe(2);
      expect(
        parsedResource.taxLots[0].bbl >=
          parsedResource.taxLots[parsedResource.taxLots.length - 1].bbl,
      ).toBe(true);
      expect(parsedResource.order).toBe("distance");
    });

    it("should return a list of tax lots filtered by a LineString with a buffer", async () => {
      const resource = await taxLotService.findMany({
        geometry: "LineString",
        buffer: 600,
        lats: [0, 1],
        lons: [0, 1],
      });
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.total).toBe(10);
      expect(
        parsedResource.taxLots[0].bbl >=
          parsedResource.taxLots[parsedResource.taxLots.length - 1].bbl,
      ).toBe(true);
      expect(parsedResource.order).toBe("distance");
    });

    it("should error when passing an invalid LineString", async () => {
      expect(
        taxLotService.findMany({
          geometry: "LineString",
          lats: [0, 0],
          lons: [1, 1],
        }),
      ).rejects.toThrow(/geometry is invalid/);
    });

    it("should return a list of tax lots filtered by a Polygon", async () => {
      const resource = await taxLotService.findMany({
        geometry: "Polygon",
        lats: [0, 1, 2, 0],
        lons: [0, 1, 2, 0],
      });
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.total).toBe(2);
      expect(
        parsedResource.taxLots[0].bbl <=
          parsedResource.taxLots[parsedResource.taxLots.length - 1].bbl,
      ).toBe(true);
      expect(parsedResource.order).toBe("distance");
    });

    it("should return a list of tax lots filtered by a Polygon with a buffer", async () => {
      const resource = await taxLotService.findMany({
        geometry: "Polygon",
        buffer: 600,
        lats: [0, 1, 2, 0],
        lons: [0, 1, 2, 0],
      });
      expect(() =>
        findTaxLotsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource = findTaxLotsQueryResponseSchema.parse(resource);
      expect(parsedResource.total).toBe(10);
      expect(
        parsedResource.taxLots[0].bbl <=
          parsedResource.taxLots[parsedResource.taxLots.length - 1].bbl,
      ).toBe(true);
      expect(parsedResource.order).toBe("distance");
    });

    it("should error when passing an invalid Polygon", async () => {
      expect(
        taxLotService.findMany({
          geometry: "Polygon",
          lats: [0, 1, 2, 3],
          lons: [0, 1, 2, 3],
        }),
      ).rejects.toThrow(/geometry is invalid/);
    });
  });

  describe("findByBbl", () => {
    it("should return a tax lot when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.findByBblMocks[0];
      const taxLot = await taxLotService.findByBbl(bbl);
      expect(() =>
        findTaxLotByBblQueryResponseSchema.parse(taxLot),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(taxLotService.findByBbl(missingBbl)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findByBblGeoJson", () => {
    it("should return a tax lot geojson when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.findByBblSpatialMocks[0];
      const taxLot = await taxLotService.findGeoJsonByBbl(bbl);
      expect(() =>
        findTaxLotGeoJsonByBblQueryResponseSchema.parse(taxLot),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(taxLotService.findGeoJsonByBbl(missingBbl)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findZoningDistrictsByBbl", () => {
    it("should return an array of zoning district(s) when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.findManyMocks[0];
      const zoningDistricts = await taxLotService.findZoningDistrictsByBbl(bbl);
      expect(() =>
        findZoningDistrictsByTaxLotBblQueryResponseSchema.parse(
          zoningDistricts,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(
        taxLotService.findZoningDistrictsByBbl(missingBbl),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findZoningDistrictClassesByBbl", () => {
    it("should return zoning district classes when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.findManyMocks[0];
      const zoningDistrictClasses =
        await taxLotService.findZoningDistrictClassesByBbl(bbl);
      expect(() =>
        findZoningDistrictClassesByTaxLotBblQueryResponseSchema.parse(
          zoningDistrictClasses,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(
        taxLotService.findZoningDistrictClassesByBbl(missingBbl),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
