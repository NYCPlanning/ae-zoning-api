import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { CommunityDistrictService } from "./community-district.service";
import { Test } from "@nestjs/testing";
import { CommunityDistrictRepository } from "./community-district.repository";
import { findCommunityDistrictTilesQueryResponseSchema } from "src/gen";

describe("CommunityDistrictService", () => {
  let communityDistrictService: CommunityDistrictService;

  const communityDistrictRepository = new CommunityDistrictRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CommunityDistrictService, CommunityDistrictRepository],
    })
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepository)
      .compile();

    communityDistrictService = moduleRef.get<CommunityDistrictService>(
      CommunityDistrictService,
    );
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await communityDistrictService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() =>
        findCommunityDistrictTilesQueryResponseSchema.parse(mvt),
      ).not.toThrow();
    });
  });
});
