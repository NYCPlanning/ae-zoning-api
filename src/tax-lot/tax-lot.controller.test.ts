import { Test } from "@nestjs/testing";
import { TaxLotController } from "./tax-lot.controller";
import { TaxLotService } from "./tax-lot.service";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";

const moduleMocker = new ModuleMocker(global);

function testFunction(r: any) {
  return r;
}

describe("TaxLotController", () => {
  let taxLotController: TaxLotController;
  let taxLotService: TaxLotService;

  // let controller: TaxLotController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TaxLotController],
      providers: [TaxLotService],
    })
      .useMocker((token) => {
        const results = {
          bbl: "1000477501",
          block: "47",
          lot: "7501",
          address: "120 BROADWAY",
          borough: { id: "1", title: "Manhattan", abbr: "MN" },
          landUse: {
            id: "05",
            description: "Commercial & Office Buildings",
            color: "#fc2929ff",
          },
        };
        if (token === TaxLotService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    // controller = moduleRef.get(TaxLotController);
    taxLotService = moduleRef.get<TaxLotService>(TaxLotService);
    taxLotController = moduleRef.get<TaxLotController>(TaxLotController);
  });

  describe("findTaxLotByBbl", () => {
    it("should return an object of taxLot", async () => {
      const result = {
        bbl: "1000477501",
        block: "47",
        lot: "7501",
        address: "120 BROADWAY",
        borough: { id: "1", title: "Manhattan", abbr: "MN" },
        landUse: {
          id: "05",
          description: "Commercial & Office Buildings",
          color: "#fc2929ff",
        },
      };
      // const result = ['test1']

      jest
        .spyOn(taxLotService, "findTaxLotByBbl")
        .mockImplementation(testFunction(result));

      expect(
        await taxLotController.findDetailsByBbl({ bbl: "1000477501" }),
      ).toBe(result);
    });
  });
});
