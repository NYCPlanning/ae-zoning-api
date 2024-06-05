import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { CapitalProjectService } from "./capital-project.service";
import { Test } from "@nestjs/testing";
import { CapitalProjectRepository } from "./capital-project.repository";
import { findCapitalProjectTilesQueryResponseSchema } from "src/gen";

describe("CapitalProjectService", () => {
  let capitalProjectService: CapitalProjectService;

  const capitalProjectRepository = new CapitalProjectRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CapitalProjectService, CapitalProjectRepository],
    })
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepository)
      .compile();

    capitalProjectService = moduleRef.get<CapitalProjectService>(
      CapitalProjectService,
    );
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await capitalProjectService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() =>
        findCapitalProjectTilesQueryResponseSchema.parse(mvt).not.toThrow(),
      );
    });
  });
});
