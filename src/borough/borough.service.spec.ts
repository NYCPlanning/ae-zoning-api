import { BoroughRepositoryMock } from "../../test/borough/borough.repository.mock";
import { Test } from "@nestjs/testing";
import { BoroughRepository } from "src/borough/borough.repository";
import { getBoroughsQueryResponseSchema } from "src/gen";
import { BoroughService } from "./borough.service";

describe("Borough service unit", () => {
  let boroughService: BoroughService;

  beforeEach(async () => {
    const boroughRepositoryMock = new BoroughRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [BoroughService, BoroughRepository],
    })
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
      .compile();

    boroughService = moduleRef.get<BoroughService>(BoroughService);
  });

  it("service should return a getBoroughsQueryResponseSchema compliant object", async () => {
    const boroughs = await boroughService.findAll();
    expect(() => getBoroughsQueryResponseSchema.parse(boroughs)).not.toThrow();
  });
});
