import { BoroughRepository } from "src/borough/borough.repository";
import { BoroughService } from "./borough.service";
import { BoroughRepositoryMock } from "../../test/borough/borough.repository.mock";
import { Test } from "@nestjs/testing";
import {
  findBoroughsQueryResponseSchema,
  findCommunityDistrictsByBoroughIdQueryResponseSchema,
} from "src/gen";
import { ResourceNotFoundException } from "src/exception";

describe("Borough service unit", () => {
  let boroughService: BoroughService;

  const boroughRepositoryMock = new BoroughRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BoroughService, BoroughRepository],
    })
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
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
      const missingId = "";
      const zoningDistrict =
        boroughService.findCommunityDistrictsByBoroughId(missingId);
      expect(zoningDistrict).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
