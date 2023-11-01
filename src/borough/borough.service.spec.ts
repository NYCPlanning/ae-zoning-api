import { EntityManager } from "@mikro-orm/postgresql";
import { BoroughService } from "./borough.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("BoroughService", () => {
  let service: BoroughService;

  const mockEntityManager = {};
  const mockBoroughRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoroughService,
        {
          provide: BoroughService,
          useValue: mockBoroughRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<BoroughService>(BoroughService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
