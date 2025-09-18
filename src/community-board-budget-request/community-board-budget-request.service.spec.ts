import { CommunityBoardBudgetRequestRepositoryMock } from "test/community-board-budget-request/community-board-budget-request.repository.mock";
import { Test } from "@nestjs/testing";
import {
  findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema,
  findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema,
  findCommunityBoardBudgetRequestAgenciesQueryResponseSchema,
  findCommunityBoardBudgetRequestByIdQueryResponseSchema,
} from "src/gen";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { BoroughRepository } from "src/borough/borough.repository";

describe("Community Board Budget Request service unit", () => {
  let communityBoardBudgetRequestService: CommunityBoardBudgetRequestService;
  const agencyRepositoryMock = new AgencyRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );
  const communityBoardBudgetRequestRepositoryMock =
    new CommunityBoardBudgetRequestRepositoryMock(agencyRepositoryMock);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommunityBoardBudgetRequestService,
        CommunityBoardBudgetRequestRepository,
        AgencyRepository,
        BoroughRepository,
      ],
    })
      .overrideProvider(CommunityBoardBudgetRequestRepository)
      .useValue(communityBoardBudgetRequestRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
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

    it("should return the full list of policy areas", async () => {
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

    it("should filter policy areas by cbbrPolicyAreaId", async () => {
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

    it("should filter policy areas by agencyInitials", async () => {
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
      const cbbrMock = communityBoardBudgetRequestRepositoryMock.cbbrMocks[0];
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
});
