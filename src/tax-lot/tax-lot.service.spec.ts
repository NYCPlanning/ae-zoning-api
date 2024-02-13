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
      const { bbl } = taxLotRepository.checkByBblMocks[0];
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
      const { bbl } = taxLotRepository.checkByBblMocks[0];
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
