import { Test } from "@nestjs/testing";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotRepositoryMock } from "test/tax-lot/tax-lot.repository.mock";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  getTaxLotByBblQueryResponseSchema,
  getTaxLotGeoJsonByBblQueryResponseSchema,
  getZoningDistrictsByTaxLotBblQueryResponseSchema,
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

  describe("findTaxLotByBbl", () => {
    it("should return a tax lot when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.findByBblMocks[0];
      const taxLot = await taxLotService.findTaxLotByBbl(bbl);
      expect(() =>
        getTaxLotByBblQueryResponseSchema.parse(taxLot),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(taxLotService.findTaxLotByBbl(missingBbl)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findTaxLotByBblGeoJson", () => {
    it("should return a tax lot geojson when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.findByBblSpatialMocks[0];
      const taxLot = await taxLotService.findTaxLotByBblGeoJson(bbl);
      expect(() =>
        getTaxLotGeoJsonByBblQueryResponseSchema.parse(taxLot),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(taxLotService.findTaxLotByBblGeoJson(missingBbl)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findZoningDistrictByTaxLotBbl", () => {
    it.only("should return an array of zoning district(s) when requesting a valid bbl", async () => {
      const { bbl } = taxLotRepository.checkTaxLotByBblMocks[0];
      const zoningDistricts =
        await taxLotService.findZoningDistrictByTaxLotBbl(bbl);
      expect(() =>
        getZoningDistrictsByTaxLotBblQueryResponseSchema.parse(zoningDistricts),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(
        taxLotService.findZoningDistrictByTaxLotBbl(missingBbl),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
