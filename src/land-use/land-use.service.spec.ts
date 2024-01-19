import { Test } from "@nestjs/testing";
import { LandUseService } from "./land-use.service";
import { LandUseRepositoryMock } from "test/land-use/land-use.repository.mock";
import { getLandUsesQueryResponseSchema } from "src/gen";
import { LandUseRepository } from "./land-use.repository";

describe("Land use service unit", () => {
  let landUseService: LandUseService;

  beforeEach(async () => {
    const landUseRepositoryMock = new LandUseRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [LandUseService, LandUseRepository],
    })
      .overrideProvider(LandUseRepository)
      .useValue(landUseRepositoryMock)
      .compile();

    landUseService = moduleRef.get<LandUseService>(LandUseService);
  });

  it("service should return a getLandUsesQueryResponseSchema compliant object", async () => {
    const landUses = await landUseService.findAll();
    expect(() => getLandUsesQueryResponseSchema.parse(landUses)).not.toThrow();
  });
});
