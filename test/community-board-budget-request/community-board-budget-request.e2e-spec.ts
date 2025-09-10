import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { CommunityBoardBudgetRequestRepository } from "src/community-board-budget-request/community-board-budget-request.repository";
import { CommunityBoardBudgetRequestRepositoryMock } from "./community-board-budget-request.repository.mock";
import { CommunityBoardBudgetRequestModule } from "src/community-board-budget-request/community-board-budget-request.module";
import { findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema } from "src/gen";
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

  describe("findPolicyAreas", () => {
    it("should 200 and return all agencies", async () => {
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
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/policy-areas?cbbrNeedGroupId=5`)
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
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/policy-areas?agencyInitials=DOHMH`,
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

    it("should 400 when finding by invalid cbbrNeedGroupId", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/policy-areas?cbbrNeedGroupId=b4d",
      );
      expect(response.body.message).toMatch(/cbbrNeedGroupId: Expected number/);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by invalid agencyInitials", async () => {
      const response = await request(app.getHttpServer()).get(
        "/community-board-budget-requests/policy-areas?agencyInitials=NONE",
      );
      expect(response.body.message).toMatch(/Invalid agency initials/);
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
