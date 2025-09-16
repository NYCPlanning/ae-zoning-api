import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { CommunityBoardBudgetRequestRepository } from "src/community-board-budget-request/community-board-budget-request.repository";
import { CommunityBoardBudgetRequestRepositoryMock } from "./community-board-budget-request.repository.mock";
import { CommunityBoardBudgetRequestModule } from "src/community-board-budget-request/community-board-budget-request.module";
import {
  findCommunityBoardBudgetRequestAgenciesQueryResponseSchema,
  findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema,
  findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema,
} from "src/gen";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";

describe("Community Board Budget Request e2e", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const communityBoardBudgetRequestRepositoryMock =
    new CommunityBoardBudgetRequestRepositoryMock(agencyRepositoryMock);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommunityBoardBudgetRequestModule],
    })
      .overrideProvider(CommunityBoardBudgetRequestRepository)
      .useValue(communityBoardBudgetRequestRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findAgencies", () => {
    it("should 200 and return all CBBR agencies", async () => {
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/agencies`)
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrAgencies.length).toBe(2);
    });

    it("should 200 when finding by a valid cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0].id;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/agencies?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrAgencies.length).toBe(1);
    });

    it("should 200 when finding by a valid cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0].id;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/agencies?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestAgenciesQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrAgencies.length).toBe(1);
    });

    it("should 400 when finding by invalid cbbrNeedGroupId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/agencies?cbbrNeedGroupId=b4d",
      );
      expect(response.body.message).toMatch(/cbbrNeedGroupId: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a missing cbbrNeedGroupId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/agencies?cbbrNeedGroupId=0",
      );
      expect(response.body.message).toMatch(/Need group id does not exist/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by invalid cbbrPolicyAreaId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/agencies?cbbrPolicyAreaId=b4d",
      );
      expect(response.body.message).toMatch(
        /cbbrPolicyAreaId: Expected number/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a missing cbbrPolicyAreaId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/agencies?cbbrPolicyAreaId=0",
      );
      expect(response.body.message).toMatch(/Policy area id does not exist/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findAgencies")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/agencies`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findNeedGroups", () => {
    it("should 200 and return all need groups", async () => {
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/need-groups`)
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrNeedGroups.length).toBe(8);
    });

    it("should 200 when finding by a valid cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0].id;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/need-groups?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrNeedGroups.length).toBe(1);
    });

    it("should 200 when finding by a valid agencyInitials", async () => {
      const agencyInitials = agencyRepositoryMock.agencies[0].initials;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/need-groups?agencyInitials=${agencyInitials}`,
        )
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrNeedGroups.length).toBe(4);
    });

    it("should 400 when finding by invalid cbbrPolicyAreaId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/need-groups?cbbrPolicyAreaId=b4d",
      );
      expect(response.body.message).toMatch(
        /cbbrPolicyAreaId: Expected number/,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a missing cbbrPolicyAreaId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/need-groups?cbbrPolicyAreaId=0",
      );
      expect(response.body.message).toMatch(/Policy area id does not exist/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by missing agencyInitials", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/need-groups?agencyInitials=NONE",
      );
      expect(response.body.message).toMatch(/Agency initials do not exist/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findNeedGroups")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/need-groups`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findPolicyAreas", () => {
    it("should 200 and return all policy areas", async () => {
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/policy-areas`)
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrPolicyAreas.length).toBe(8);
    });

    it("should 200 when finding by a valid cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0].id;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/policy-areas?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrPolicyAreas.length).toBe(1);
    });

    it("should 200 when finding by a valid agencyInitials", async () => {
      const agencyInitials = agencyRepositoryMock.agencies[0].initials;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/policy-areas?agencyInitials=${agencyInitials}`,
        )
        .expect(200);
      expect(() =>
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.cbbrPolicyAreas.length).toBe(4);
    });

    it("should 400 when finding by invalid cbbrNeedGroupId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/policy-areas?cbbrNeedGroupId=b4d",
      );
      expect(response.body.message).toMatch(/cbbrNeedGroupId: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a missing cbbrNeedGroupId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/policy-areas?cbbrNeedGroupId=0",
      );
      expect(response.body.message).toMatch(/Need group id does not exist/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by missing agencyInitials", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/policy-areas?agencyInitials=NONE",
      );
      expect(response.body.message).toMatch(/Agency initials do not exist/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findPolicyAreas")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/policy-areas`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
