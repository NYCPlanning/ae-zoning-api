import { CommunityBoardBudgetRequestRepositoryMock } from "test/community-board-budget-request/community-board-budget-request.repository.mock";
import { Test } from "@nestjs/testing";
import {
  findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema,
  findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema,
} from "src/gen";
import { CommunityBoardBudgetRequestService } from "./community-board-budget-request.service";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import { InvalidRequestParameterException } from "src/exception";

describe("Community Board Budget Request service unit", () => {
  let communityBoardBudgetRequestService: CommunityBoardBudgetRequestService;
  const agencyRepositoryMock = new AgencyRepositoryMock();
  const communityBoardBudgetRequestRepositoryMock =
    new CommunityBoardBudgetRequestRepositoryMock(agencyRepositoryMock);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommunityBoardBudgetRequestService,
        CommunityBoardBudgetRequestRepository,
        AgencyRepository,
      ],
    })
      .overrideProvider(CommunityBoardBudgetRequestRepository)
      .useValue(communityBoardBudgetRequestRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .compile();

    communityBoardBudgetRequestService =
      moduleRef.get<CommunityBoardBudgetRequestService>(
        CommunityBoardBudgetRequestService,
      );
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
});
