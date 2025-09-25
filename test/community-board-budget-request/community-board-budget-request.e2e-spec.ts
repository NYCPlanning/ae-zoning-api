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
  findCommunityBoardBudgetRequestByIdQueryResponseSchema,
  findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema,
  findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema,
  findCommunityBoardBudgetRequestsQueryResponseSchema,
} from "src/gen";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { BoroughRepository } from "src/borough/borough.repository";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";

describe("Community Board Budget Request e2e", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const cityCouncilDistrictRepoMock = new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );

  const communityBoardBudgetRequestRepositoryMock =
    new CommunityBoardBudgetRequestRepositoryMock(
      agencyRepositoryMock,
      cityCouncilDistrictRepoMock,
    );

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommunityBoardBudgetRequestModule],
    })
      .overrideProvider(CommunityBoardBudgetRequestRepository)
      .useValue(communityBoardBudgetRequestRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepoMock)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
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

  describe("findById", () => {
    it("should 200 and return a community board budget request", async () => {
      const cbbrMock = communityBoardBudgetRequestRepositoryMock.cbbrMocks[0];

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${cbbrMock.id}`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestByIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 404 when finding a non-existent cbbrId", async () => {
      const nonExistentCbbrId = "1234XYZ";

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${nonExistentCbbrId}`)
        .expect(404);

      expect(response.body.message).toMatch(
        /Cannot find Community Board Budget Request/,
      );
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const cbbrMock = communityBoardBudgetRequestRepositoryMock.cbbrMocks[0];

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${cbbrMock.id}`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findMany", () => {
    it("should 200 and return a list of community board budget requests", async () => {
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.communityBoardBudgetRequests.length).toBe(
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks.length,
      );
      expect(parsedBody.communityBoardBudgetRequests.length).toBeGreaterThan(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should 200 when finding cbbrs by boroughId", async () => {
      const boroughAbbr =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0].communityBoardId.slice(
          0,
          2,
        );
      const boroughId =
        communityBoardBudgetRequestRepositoryMock.getBoroughIdFromAbbr(
          boroughAbbr,
        );
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?boroughId=${boroughId}`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by communityDistrictId", async () => {
      const boroughAbbr =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0].communityBoardId.slice(
          0,
          2,
        );
      const boroughId =
        communityBoardBudgetRequestRepositoryMock.getBoroughIdFromAbbr(
          boroughAbbr,
        );
      const communityDistrictId = `${boroughId}${communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0].communityBoardId.slice(
        2,
        4,
      )}`;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?communityDistrictId=${communityDistrictId}`,
        )
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by cityCouncilDistrictId", async () => {
      const cityCouncilDistrictId =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0]
          .cityCouncilDistrictId;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cityCouncilDistrictId=${cityCouncilDistrictId}`,
        )
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0]
          .cbbrPolicyAreaId;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0]
          .cbbrNeedGroupId;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by agencyInitials", async () => {
      const agencyInitials =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0]
          .agencyInitials;
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?agencyInitials=${agencyInitials}`,
        )
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by cbbrType", async () => {
      const cbbrType =
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0].cbbrType[0];
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?cbbrType=${cbbrType}`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
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

    it("should 200 when finding cbbrs by cbbrAgencyResponseTypeId", async () => {
      const cbbrAgencyResponseTypeId = [
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[0]
          .agencyCategoryResponse,
        communityBoardBudgetRequestRepositoryMock.manyCbbrMocks[1]
          .agencyCategoryResponse,
      ];
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrAgencyResponseTypeId=${cbbrAgencyResponseTypeId}`,
        )
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should 200 when finding cbbrs by isMapped", async () => {
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?isMapped=true`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should 200 when finding cbbrs by isContinuedSupport", async () => {
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?isContinuedSupport=true`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();

      const parsedBody =
        findCommunityBoardBudgetRequestsQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.total).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
      expect(parsedBody.totalBudgetRequests).toBe(
        parsedBody.communityBoardBudgetRequests.length,
      );
    });

    it("should 400 when finding cbbrs by an invalid boroughId", async () => {
      const boroughId = false;

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?boroughId=${boroughId}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: boroughId: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by an invalid communityDistrictId", async () => {
      const communityDistrictId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?communityDistrictId=${communityDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: communityDistrictId: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cityCouncilDistrictId", async () => {
      const cityCouncilDistrictId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cityCouncilDistrictId=${cityCouncilDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cityCouncilDistrictId: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrPolicyAreaId: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrNeedGroupId: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by an invalid agencyInitials", async () => {
      const agencyInitials = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?agencyInitials=${agencyInitials}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: could not check one or more of the parameters/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrType", async () => {
      const cbbrType = false;

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?cbbrType=${cbbrType}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrType: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrAgencyResponseTypeId", async () => {
      const cbbrAgencyResponseTypeId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrAgencyResponseTypeId=${cbbrAgencyResponseTypeId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrAgencyResponseTypeId: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by an invalid isMapped", async () => {
      const isMapped = "maybe";

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests?isMapped=${isMapped}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: invalid value for boolean schema property/,
      );
    });

    it("should 400 when finding cbbrs by an invalid isContinuedSupport", async () => {
      const isContinuedSupport = "maybe";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?isContinuedSupport=${isContinuedSupport}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: invalid value for boolean schema property/,
      );
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
