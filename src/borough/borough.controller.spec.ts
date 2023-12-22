import { Test, TestingModule } from "@nestjs/testing";
import { BoroughController } from "./borough.controller";
import { BoroughService } from "./borough.service";
import { DataRetrievalException } from "src/exception";

const mockBoroughs = {
  boroughs: [{ name: "Manhattan" }],
};
describe("BoroughController", () => {
  let boroughService: BoroughService;
  let boroughController: BoroughController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoroughController],
      providers: [
        {
          provide: BoroughService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockBoroughs),
          },
        },
      ],
    }).compile();
    boroughService = module.get<BoroughService>(BoroughService);
    boroughController = module.get<BoroughController>(BoroughController);
  });

  it("should be defined", () => {
    expect(boroughController).toBeDefined();
  });

  describe("findAll", () => {
    it("should get an array of boroughs", async () => {
      const boroughs = await boroughController.findAll();
      expect(boroughs).toEqual(mockBoroughs);
    });

    it.only("should return an internal server error", async () => {
      jest.spyOn(boroughService, "findAll").mockImplementationOnce(() => {
        throw new DataRetrievalException();
      });
      // await boroughController.findAll();
      // expect(boroughService.findAll).toThrow(DataRetrievalException);

      const boroughs = await boroughController.findAll();
      expect(boroughService.findAll).toThrow(DataRetrievalException);
      console.info("these are the boroughs", boroughs);
      expect(false).toEqual(true);
    });
  });
});
