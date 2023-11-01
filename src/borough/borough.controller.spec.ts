import { Test, TestingModule } from "@nestjs/testing";
import { BoroughController } from "./borough.controller";
import { BoroughService } from "./borough.service";

describe("BoroughController", () => {
  let controller: BoroughController;

  const mockBoroughService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoroughController],
      providers: [BoroughService],
    })
      .overrideProvider(BoroughService)
      .useValue(mockBoroughService)
      .compile();

    controller = module.get<BoroughController>(BoroughController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
