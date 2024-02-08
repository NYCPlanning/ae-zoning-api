import { Test } from "@nestjs/testing";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotRepositoryMock } from "test/tax-lot/tax-lot.repository.mock";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  findTaxLotByBblQueryResponseSchema,
  findTaxLotGeoJsonByBblQueryResponseSchema,
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

  describe("findZoningDistrictByBbl", () => {
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

  describe("findZoningDistrictClassByBbl", () => {
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
