import { CommunityBoardBudgetRequestRepositoryMock } from "test/community-board-budget-request/community-board-budget-request.repository.mock";
import { Test } from "@nestjs/testing";
import { findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema } from "src/gen";
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
