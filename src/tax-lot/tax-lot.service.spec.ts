import { Test } from "@nestjs/testing";
import { TaxLotService } from "./tax-lot.service";
import { TaxLotRepositoryMock } from "test/tax-lot/tax-lot.repository.mock";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import { getTaxLotGeoJsonByBblQueryResponseSchema } from "src/gen";

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
});