import { BoroughRepository } from "src/borough/borough.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { BoroughService } from "./borough.service";
import { BoroughRepositoryMock } from "../../test/borough/borough.repository.mock";
import { Test } from "@nestjs/testing";
import {
  findBoroughsQueryResponseSchema,
  findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema,
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
} from "src/gen";
import { ResourceNotFoundException } from "src/exception";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";

describe("Borough service unit", () => {
  let boroughService: BoroughService;

  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );

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

  describe("findCommunityDistrictsByBoroughId", () => {
    it("service should return a community districts compliant object", async () => {
      const { id } = boroughRepositoryMock.checkBoroughByIdMocks[0];
      const communityDistricts =
        await boroughService.findCommunityDistrictsByBoroughId(id);

      expect(() =>
        findCommunityDistrictsByBoroughIdQueryResponseSchema.parse(
          communityDistricts,
        ),
      ).not.toThrow();
    });

    it("service should throw a resource error when requesting with a missing id", async () => {
      const missingId = "9";
      const zoningDistrict =
        boroughService.findCommunityDistrictsByBoroughId(missingId);
      expect(zoningDistrict).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findCapitalProjectsByBoroughIdCommunityDistrictId", () => {
    const boroughId = boroughRepositoryMock.checkBoroughByIdMocks[0].id;
    const communityDistrictId =
      boroughRepositoryMock.communityDistrictRepoMock
        .checkCommunityDistrictByIdMocks[0].id;
    it("service should return a capital projects compliant object using default query params", async () => {
      const capitalProjects =
        await boroughService.findCapitalProjectsByBoroughIdCommunityDistrictId({
          boroughId,
          communityDistrictId,
        });

      expect(() =>
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          capitalProjects,
        ),
      ).not.toThrow();

      const parsedBody =
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          capitalProjects,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("service should return a list of capital projects by community district id, using the user specified limit and offset", async () => {
      const capitalProjects =
        await boroughService.findCapitalProjectsByBoroughIdCommunityDistrictId({
          boroughId,
          communityDistrictId,
          limit: 10,
          offset: 3,
        });

      expect(() =>
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          capitalProjects,
        ),
      ).not.toThrow();

      const parsedBody =
        findCapitalProjectsByBoroughIdCommunityDistrictIdQueryResponseSchema.parse(
          capitalProjects,
        );
      expect(parsedBody.limit).toBe(10);
      expect(parsedBody.offset).toBe(3);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });
  });
});
