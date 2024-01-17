import { Test } from "@nestjs/testing";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotRepositoryMock } from "test/tax-lot/tax-lot.repository.mock";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import {
  getTaxLotByBblQueryResponseSchema,
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
      const mock = taxLotRepository.findByBblMocks[0];
      const taxLot = await taxLotService.findTaxLotByBbl(mock.bbl);
      expect(() =>
        getTaxLotByBblQueryResponseSchema.parse(taxLot),
      ).not.toThrow();
    });

    it("should throw a resource error when request a missing bbl", async () => {
      const missingBbl = "0123456789";
      expect(taxLotService.findTaxLotByBbl(missingBbl)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findZoningDistrictByTaxLotBbl", () => {
    it("should return zoning districts when requesting a valid bbl", async () => {
      const mock = taxLotRepository.findZoningDistrictByTaxLotBblMocks[0];
      const [checkTaxLotMock] = mock;
      const zoningDistricts = await taxLotService.findZoningDistrictByTaxLotBbl(
        checkTaxLotMock.bbl,
      );
      expect(() =>
        getZoningDistrictsByTaxLotBblQueryResponseSchema.parse(zoningDistricts),
      ).not.toThrow();
    });

    it("should throw a resource error when request a missing bbl", () => {
      const missingBbl = "0123456789";
      expect(
        taxLotService.findZoningDistrictByTaxLotBbl(missingBbl),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
