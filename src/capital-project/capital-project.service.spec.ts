import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { CapitalProjectService } from "./capital-project.service";
import { Test } from "@nestjs/testing";
import { CapitalProjectRepository } from "./capital-project.repository";
import {
  findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectTilesQueryResponseSchema,
} from "src/gen";
import { ResourceNotFoundException } from "src/exception";

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

  describe("findByManagingCodeCapitalProjectId", () => {
    it("should return a capital project with budget details", async () => {
      const capitalProjectMock =
        capitalProjectRepository.findByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const capitalProject =
        await capitalProjectService.findByManagingCodeCapitalProjectId({
          managingCode,
          capitalProjectId,
        });

      expect(() =>
        findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          capitalProject,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const missingManagingCode = "890";
      const missingCapitalProjectId = "ABCD";

      expect(
        capitalProjectService.findByManagingCodeCapitalProjectId({
          managingCode: missingManagingCode,
          capitalProjectId: missingCapitalProjectId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findGeoJsonByManagingCodeCapitalProjectId", () => {
    it("should return a capital project geojson with a valid request", async () => {
      const capitalProjectGeoJsonMock =
        capitalProjectRepository
          .findGeoJsonByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectGeoJsonMock;
      const capitalProjectGeoJson =
        await capitalProjectService.findGeoJsonByManagingCodeCapitalProjectId({
          managingCode,
          capitalProjectId,
        });

      expect(() =>
        findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          capitalProjectGeoJson,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const missingManagingCode = "890";
      const missingCapitalProjectId = "ABCD";

      expect(
        capitalProjectService.findGeoJsonByManagingCodeCapitalProjectId({
          managingCode: missingManagingCode,
          capitalProjectId: missingCapitalProjectId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await capitalProjectService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() =>
        findCapitalProjectTilesQueryResponseSchema.parse(mvt),
      ).not.toThrow();
    });
  });

  describe("findCapitalCommitmentsByManagingCodeCapitalProjectId", () => {
    it("should return capital commitments for a capital project", async () => {
      const { id: capitalProjectId, managingCode } =
        capitalProjectRepository.checkByManagingCodeCapitalProjectIdMocks[0];
      const result =
        await capitalProjectService.findCapitalCommitmentsByManagingCodeCapitalProjectId(
          { capitalProjectId, managingCode },
        );

      expect(() =>
        findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          result,
        ),
      ).not.toThrow();

      expect(result.order).toBe("plannedDate");
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const missingManagingCode = "725";
      const missingCapitalProjectId = "JIRO";

      expect(
        capitalProjectService.findCapitalCommitmentsByManagingCodeCapitalProjectId(
          {
            managingCode: missingManagingCode,
            capitalProjectId: missingCapitalProjectId,
          },
        ),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
