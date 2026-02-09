import { BoroughRepository } from "src/borough/borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { BoroughService } from "./borough.service";
import { BoroughRepositoryMock } from "../../test/borough/borough.repository.mock";
import { Test } from "@nestjs/testing";
import {
  findBoroughsQueryResponseSchema,
  findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponseSchema,
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
} from "src/gen";
import { ResourceNotFoundException } from "src/exception";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import {
  findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema,
  findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdRepoSchema,
  findTilesRepoSchema,
} from "./borough.repository.schema";

describe("Borough service unit", () => {
  let boroughService: BoroughService;

  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BoroughService,
        BoroughRepository,
        CommunityDistrictRepository,
      ],
    })
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .compile();

    boroughService = moduleRef.get<BoroughService>(BoroughService);
  });

  describe("findMany", () => {
    it("service should return a findBoroughsQueryResponseSchema compliant object", async () => {
      const boroughs = await boroughService.findMany();
      expect(() =>
        findBoroughsQueryResponseSchema.parse(boroughs),
      ).not.toThrow();
    });
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await boroughService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() => findTilesRepoSchema.parse(mvt)).not.toThrow();
    });
  });

  describe("findCommunityDistrictsByBoroughId", () => {
    it("service should return a community districts compliant object", async () => {
      const { id } = boroughRepositoryMock.boroughs[0];
      const communityDistricts =
        await boroughService.findCommunityDistrictsByBoroughId(id);

      expect(() =>
        findCommunityDistrictsByBoroughIdQueryResponseSchema.parse(
          communityDistricts,
        ),
      ).not.toThrow();

      expect(communityDistricts.order).toBe("id");
    });

    it("service should throw a resource error when requesting with a missing id", async () => {
      const missingId = "9";
      const zoningDistrict =
        boroughService.findCommunityDistrictsByBoroughId(missingId);
      expect(zoningDistrict).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId", () => {
    it("should return a community district geojson when requesting a valid id", async () => {
      const { boroughId, id: communityDistrictId } =
        boroughRepositoryMock
          .findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdMocks[0];
      const communityDistrictGeoJson =
        await boroughService.findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId(
          {
            boroughId,
            communityDistrictId,
          },
        );
      expect(() =>
        findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          communityDistrictGeoJson,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing id", async () => {
      const boroughId = "1";
      const missingId = "00";
      expect(
        boroughService.findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId(
          {
            boroughId,
            communityDistrictId: missingId,
          },
        ),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findCapitalProjectTilesByBoroughIdCommunityDistrictId", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt =
        await boroughService.findCapitalProjectTilesByBoroughIdCommunityDistrictId(
          {
            boroughId: "1",
            communityDistrictId: "01",
            z: 1,
            x: 1,
            y: 1,
          },
        );
      expect(() =>
        findCapitalProjectTilesByBoroughIdCommunityDistrictIdRepoSchema.parse(
          mvt,
        ),
      ).not.toThrow();
    });
  });

  describe("findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt =
        await boroughService.findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictId(
          {
            boroughId: "1",
            communityDistrictId: "01",
            z: 1,
            x: 1,
            y: 1,
          },
        );

      expect(() =>
        findCommunityBoardBudgetRequestTilesByBoroughIdCommunityDistrictIdRepoSchema.parse(
          mvt,
        ),
      ).not.toThrow();
    });
  });
});
