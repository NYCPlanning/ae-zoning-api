import { CommunityBoardBudgetRequestRepositoryMock } from "test/community-board-budget-request/community-board-budget-request.repository.mock";
import { Test } from "@nestjs/testing";
import {
  findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema,
  findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema,
  findCommunityBoardBudgetRequestAgenciesQueryResponseSchema,
  findCommunityBoardBudgetRequestByIdQueryResponseSchema,
  findCommunityBoardBudgetRequestsQueryResponseSchema,
  findCommunityBoardBudgetRequestAgencyCategoryResponsesQueryResponseSchema,
  findCommunityBoardBudgetRequestGeoJsonByIdQueryResponseSchema,
} from "src/gen";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { CommunityBoardBudgetRequestModule } from "./community-board-budget-request.module";
import {
  communityBoardBudgetRequestCsvRepoSchema,
  findCsvRepoSchema,
  findTilesRepoSchema,
} from "./community-board-budget-request.repository.schema";

describe("Community Board Budget Request service unit", () => {
  let communityBoardBudgetRequestService: CommunityBoardBudgetRequestService;
  const agencyRepositoryMock = new AgencyRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const communityBoardBudgetRequestRepositoryMock =
    new CommunityBoardBudgetRequestRepositoryMock(
      agencyRepositoryMock,
      cityCouncilDistrictRepositoryMock,
      communityDistrictRepositoryMock,
    );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommunityBoardBudgetRequestModule],
    })
      .overrideProvider(CommunityBoardBudgetRequestRepository)
      .useValue(communityBoardBudgetRequestRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .compile();

    communityBoardBudgetRequestService =
      moduleRef.get<CommunityBoardBudgetRequestService>(
        CommunityBoardBudgetRequestService,
      );
  });

  describe("findAgencies", () => {
    it("should return a findCommunityBoardBudgetRequestAgenciesQueryResponseSchema compliant object", async () => {
      const agencies = await communityBoardBudgetRequestService.findAgencies(
        {},
      );
      expect(() =>
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          agencies,
        ),
      ).not.toThrow();
    });

    it("should return the full list of agencies", async () => {
      const agencies = await communityBoardBudgetRequestService.findAgencies(
        {},
      );
      expect(agencies.cbbrAgencies.length).toBe(2);
    });

    it("should return an InvalidRequestParameter error when a policy area with the given id cannot be found", async () => {
      const cbbrPolicyAreaId = 0;

      expect(
        communityBoardBudgetRequestService.findAgencies({
          cbbrPolicyAreaId,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should filter agencies by cbbrPolicyAreaId", async () => {
      const { id: policyAreaId } =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0];
      const agencies = await communityBoardBudgetRequestService.findAgencies({
        cbbrPolicyAreaId: policyAreaId,
      });
      expect(agencies.cbbrAgencies.length).toBe(1);
    });

    it("should return an InvalidRequestParameter error when a need group with the given id cannot be found", async () => {
      const cbbrNeedGroupId = 0;

      expect(
        communityBoardBudgetRequestService.findAgencies({
          cbbrNeedGroupId,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should filter agencies by cbbrNeedGroupId", async () => {
      const { id: needGroupId } =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0];
      const agencies = await communityBoardBudgetRequestService.findAgencies({
        cbbrNeedGroupId: needGroupId,
      });
      expect(agencies.cbbrAgencies.length).toBe(1);
    });
  });

  describe("findNeedGroups", () => {
    it("should return a findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema compliant object", async () => {
      const needGroups =
        await communityBoardBudgetRequestService.findNeedGroups({});
      expect(() =>
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          needGroups,
        ),
      ).not.toThrow();
    });

    it("should return the full list of need groups", async () => {
      const needGroups =
        await communityBoardBudgetRequestService.findNeedGroups({});
      expect(needGroups.cbbrNeedGroups.length).toBe(8);
    });

    it("should return an InvalidRequestParameter error when a policy area with the given id cannot be found", async () => {
      const cbbrPolicyAreaId = 0;

      expect(
        communityBoardBudgetRequestService.findNeedGroups({
          cbbrPolicyAreaId,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should filter need groups by cbbrPolicyAreaId", async () => {
      const { id: policyAreaId } =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0];
      const needGroups =
        await communityBoardBudgetRequestService.findNeedGroups({
          cbbrPolicyAreaId: policyAreaId,
        });
      expect(needGroups.cbbrNeedGroups.length).toBe(1);
    });

    it("should return an InvalidRequestParameter error when an agency with the given initials cannot be found", async () => {
      const agencyInitials = "FAKE";

      expect(
        communityBoardBudgetRequestService.findNeedGroups({
          agencyInitials,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should filter need groups by agencyInitials", async () => {
      const { initials: agencyInitials } = agencyRepositoryMock.agencies[0];
      const needGroups =
        await communityBoardBudgetRequestService.findNeedGroups({
          agencyInitials,
        });
      expect(needGroups.cbbrNeedGroups.length).toBe(4);
    });
  });

  describe("findPolicyAreas", () => {
    it("should return a findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema compliant object", async () => {
      const policyAreas =
        await communityBoardBudgetRequestService.findPolicyAreas({});
      expect(() =>
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          policyAreas,
        ),
      ).not.toThrow();
    });

    it("should return the full list of policy areas", async () => {
      const policyAreas =
        await communityBoardBudgetRequestService.findPolicyAreas({});
      expect(policyAreas.cbbrPolicyAreas.length).toBe(8);
    });

    it("should return an InvalidRequestParameter error when a need group with the given id cannot be found", async () => {
      const cbbrNeedGroupId = 0;

      expect(
        communityBoardBudgetRequestService.findPolicyAreas({
          cbbrNeedGroupId,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should filter policy areas by cbbrNeedGroupId", async () => {
      const { id: needGroupId } =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0];
      const policyAreas =
        await communityBoardBudgetRequestService.findPolicyAreas({
          cbbrNeedGroupId: needGroupId,
        });
      expect(policyAreas.cbbrPolicyAreas.length).toBe(1);
    });

    it("should return an InvalidRequestParameter error when an agency with the given initials cannot be found", async () => {
      const agencyInitials = "FAKE";

      expect(
        communityBoardBudgetRequestService.findPolicyAreas({
          agencyInitials,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should filter policy areas by agencyInitials", async () => {
      const { initials: agencyInitials } = agencyRepositoryMock.agencies[0];
      const policyAreas =
        await communityBoardBudgetRequestService.findPolicyAreas({
          agencyInitials,
        });
      expect(policyAreas.cbbrPolicyAreas.length).toBe(4);
    });
  });

  describe("findById", () => {
    it("should return a findCommunityBoardBudgetRequestByIdQueryResponseSchema compliant object", async () => {
      const cbbrMock =
        communityBoardBudgetRequestRepositoryMock.findByIdMocks[0];
      const cbbr = await communityBoardBudgetRequestService.findById({
        cbbrId: cbbrMock.id,
      });
      expect(() =>
        findCommunityBoardBudgetRequestByIdQueryResponseSchema.parse(cbbr),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a non-existent cbbrId", async () => {
      const nonExistentCbbrId = "1234XYZ";

      expect(() =>
        communityBoardBudgetRequestService.findById({
          cbbrId: nonExistentCbbrId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findMany", () => {
    it("should return a list of community board budget requests", async () => {
      const cbbrs = await communityBoardBudgetRequestService.findMany({});

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBe(
        communityBoardBudgetRequestRepositoryMock.findManyMocks.length,
      );
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by community district", async () => {
      const communityDistrict = communityDistrictRepositoryMock.districts[0];
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        communityDistrictCombinedId: `${communityDistrict.boroughId}${communityDistrict.id}`,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by city council district", async () => {
      const cityCouncilDistrictId =
        cityCouncilDistrictRepositoryMock.districts[0].id;
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        cityCouncilDistrictId,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by policy area", async () => {
      const cbbrPolicyAreaId =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0].id;
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        cbbrPolicyAreaId,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by need group", async () => {
      const cbbrNeedGroupId =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0].id;
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        cbbrNeedGroupId,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by agency initials", async () => {
      const agencyInitials = agencyRepositoryMock.agencies[0].initials;
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        agencyInitials,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by request type", async () => {
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        cbbrType: "C",
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of community board budget requests filtered by agency response types", async () => {
      const cbbrAgencyCategoryResponseIds = [
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[0].id,
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[1].id,
      ];
      const cbbrs = await communityBoardBudgetRequestService.findMany({
        cbbrAgencyCategoryResponseIds,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(cbbrs);
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should return a list of mapped or unmapped community board budget requests", async () => {
      const mappedCbbrs = await communityBoardBudgetRequestService.findMany({
        isMapped: true,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(mappedCbbrs),
      ).not.toThrow();

      const mapped =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(mappedCbbrs);
      expect(mapped.limit).toBe(20);
      expect(mapped.offset).toBe(0);
      expect(mapped.total).toBe(mapped.communityBoardBudgetRequests.length);
      expect(mapped.totalBudgetRequests).toBe(
        mapped.communityBoardBudgetRequests.length,
      );

      const unMappedCbbrs = await communityBoardBudgetRequestService.findMany({
        isMapped: false,
      });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          unMappedCbbrs,
        ),
      ).not.toThrow();

      const unMapped =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          unMappedCbbrs,
        );
      expect(unMapped.limit).toBe(20);
      expect(unMapped.offset).toBe(0);
      expect(unMapped.total).toBe(unMapped.communityBoardBudgetRequests.length);
      expect(unMapped.totalBudgetRequests).toBe(
        unMapped.communityBoardBudgetRequests.length,
      );

      const allCbbrs = await communityBoardBudgetRequestService.findMany({});
      const all =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(allCbbrs);
      expect(mapped.totalBudgetRequests + unMapped.totalBudgetRequests).toBe(
        all.totalBudgetRequests,
      );
    });

    it("should return a list of community board budget requests filtered by whether or not they are for continued support", async () => {
      const continuedSupportCbbrs =
        await communityBoardBudgetRequestService.findMany({
          isContinuedSupport: true,
        });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          continuedSupportCbbrs,
        ),
      ).not.toThrow();

      const continuedSupport =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          continuedSupportCbbrs,
        );
      expect(continuedSupport.limit).toBe(20);
      expect(continuedSupport.offset).toBe(0);
      expect(continuedSupport.total).toBe(
        continuedSupport.communityBoardBudgetRequests.length,
      );
      expect(continuedSupport.totalBudgetRequests).toBe(
        continuedSupport.communityBoardBudgetRequests.length,
      );

      const nonContinuedSupportCbbrs =
        await communityBoardBudgetRequestService.findMany({
          isContinuedSupport: false,
        });

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          nonContinuedSupportCbbrs,
        ),
      ).not.toThrow();

      const nonContinuedSupport =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          nonContinuedSupportCbbrs,
        );
      expect(nonContinuedSupport.limit).toBe(20);
      expect(nonContinuedSupport.offset).toBe(0);
      expect(nonContinuedSupport.total).toBe(
        nonContinuedSupport.communityBoardBudgetRequests.length,
      );
      expect(nonContinuedSupport.totalBudgetRequests).toBe(
        nonContinuedSupport.communityBoardBudgetRequests.length,
      );

      const allCbbrs = await communityBoardBudgetRequestService.findMany({});
      const all =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(allCbbrs);
      expect(
        continuedSupport.totalBudgetRequests +
          nonContinuedSupport.totalBudgetRequests,
      ).toBe(all.totalBudgetRequests);
    });
  });

  describe("findAgencyCategoryResponses", () => {
    it("should return a findCommunityBoardBudgetRequestAgencyCategoryResponsesQueryResponseSchema compliant object", async () => {
      const agencyCategoryResponses =
        await communityBoardBudgetRequestService.findAgencyCategoryResponses();
      expect(() =>
        findCommunityBoardBudgetRequestAgencyCategoryResponsesQueryResponseSchema.parse(
          agencyCategoryResponses,
        ),
      ).not.toThrow();
    });

    it("should return the full list of agency response types", async () => {
      const agencyCategoryResponses =
        await communityBoardBudgetRequestService.findAgencyCategoryResponses();
      expect(agencyCategoryResponses.cbbrAgencyCategoryResponses.length).toBe(
        8,
      );
    });
  });

  describe("findGeoJsonById", () => {
    it("should return a community board budget request geojson with a valid request", async () => {
      const communityBoardBudgetRequestGeoJsonMock =
        communityBoardBudgetRequestRepositoryMock.findGeoJsonByIdMock[0];
      const { id: cbbrId } = communityBoardBudgetRequestGeoJsonMock;
      const communityBoardBudgetRequestGeoJson =
        await communityBoardBudgetRequestService.findGeoJsonById({
          cbbrId,
        });

      expect(() =>
        findCommunityBoardBudgetRequestGeoJsonByIdQueryResponseSchema.parse(
          communityBoardBudgetRequestGeoJson,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const cbbrId = "1234XYZ";

      expect(
        communityBoardBudgetRequestService.findGeoJsonById({
          cbbrId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await communityBoardBudgetRequestService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() => findTilesRepoSchema.parse(mvt)).not.toThrow();
    });
  });

  describe("findCsv", () => {
    it("should return a list of community board budget requests for download", async () => {
      const csv = await communityBoardBudgetRequestService.findCsv({});
      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(
        communityBoardBudgetRequestRepositoryMock.findCsvMocks.length,
      );
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by community district", async () => {
      const communityDistrict = communityDistrictRepositoryMock.districts[0];
      const csv = await communityBoardBudgetRequestService.findCsv({
        communityDistrictCombinedId: `${communityDistrict.boroughId}${communityDistrict.id}`,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(4);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by city council district", async () => {
      const cityCouncilDistrictId =
        cityCouncilDistrictRepositoryMock.districts[0].id;
      const csv = await communityBoardBudgetRequestService.findCsv({
        cityCouncilDistrictId,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(4);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by policy area", async () => {
      const cbbrPolicyAreaId =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0].id;
      const csv = await communityBoardBudgetRequestService.findCsv({
        cbbrPolicyAreaId,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(1);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by need group", async () => {
      const cbbrNeedGroupId =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0].id;
      const csv = await communityBoardBudgetRequestService.findCsv({
        cbbrNeedGroupId,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(1);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by agency initials", async () => {
      const agencyInitials = agencyRepositoryMock.agencies[0].initials;
      const csv = await communityBoardBudgetRequestService.findCsv({
        agencyInitials,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(4);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by request type", async () => {
      const csv = await communityBoardBudgetRequestService.findCsv({
        cbbrType: "C",
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(4);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered by agency response types", async () => {
      const cbbrAgencyCategoryResponseIds = [
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[0].id,
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[1].id,
      ];
      const csv = await communityBoardBudgetRequestService.findCsv({
        cbbrAgencyCategoryResponseIds,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(2);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of mapped community board budget requests for download", async () => {
      const csv = await communityBoardBudgetRequestService.findCsv({
        isMapped: true,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(3);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of unmapped community board budget requests for download", async () => {
      const csv = await communityBoardBudgetRequestService.findCsv({
        isMapped: false,
      });

      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(5);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return lists of mapped and unmapped community board budget requests for download that total all requests", async () => {
      const mappedCsv = await communityBoardBudgetRequestService.findCsv({
        isMapped: true,
      });
      const unmappedCsv = await communityBoardBudgetRequestService.findCsv({
        isMapped: false,
      });

      expect(mappedCsv.length + unmappedCsv.length).toBe(
        communityBoardBudgetRequestRepositoryMock.findCsvMocks.length,
      );
    });

    it("should return a list of community board budget requests for download filtered for continued support", async () => {
      const csv = await communityBoardBudgetRequestService.findCsv({
        isContinuedSupport: true,
      });
      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(2);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a list of community board budget requests for download filtered for continued support", async () => {
      const csv = await communityBoardBudgetRequestService.findCsv({
        isContinuedSupport: false,
      });
      expect(() => findCsvRepoSchema.parse(csv)).not.toThrow();
      expect(csv.length).toBe(6);
      const firstItem = csv[0];
      expect(() =>
        communityBoardBudgetRequestCsvRepoSchema.strict().parse(firstItem),
      ).not.toThrow();
    });

    it("should return a lists of community board budget requests for download with sum of all continued support statuses", async () => {
      const continuedSupportCsv =
        await communityBoardBudgetRequestService.findCsv({
          isContinuedSupport: true,
        });
      const notContinuedSupportCsv =
        await communityBoardBudgetRequestService.findCsv({
          isContinuedSupport: false,
        });

      expect(continuedSupportCsv.length + notContinuedSupportCsv.length).toBe(
        communityBoardBudgetRequestRepositoryMock.findCsvMocks.length,
      );
    });
  });
});
