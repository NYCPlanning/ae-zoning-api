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
  findCommunityBoardBudgetRequestGeoJsonByIdQueryResponseSchema,
  findCommunityBoardBudgetRequestNeedGroupsQueryResponseSchema,
  findCommunityBoardBudgetRequestPolicyAreasQueryResponseSchema,
  findCommunityBoardBudgetRequestsQueryResponseSchema,
} from "src/gen";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyRepository } from "src/agency/agency.repository";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import { BoroughRepository } from "src/borough/borough.repository";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";

describe("Community Board Budget Request e2e", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const agencyBudgetRepositoryMock = new AgencyBudgetRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const communityBoardBudgetRequestRepositoryMock =
    new CommunityBoardBudgetRequestRepositoryMock(
      agencyRepositoryMock,
      cityCouncilDistrictRepositoryMock,
      communityDistrictRepositoryMock,
    );
  const capitalProjectRepositoryMock = new CapitalProjectRepositoryMock(
    agencyRepositoryMock,
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
    agencyBudgetRepositoryMock,
    boroughRepositoryMock,
  );
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommunityBoardBudgetRequestModule],
    })
      .overrideProvider(CommunityBoardBudgetRequestRepository)
      .useValue(communityBoardBudgetRequestRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepositoryMock)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepositoryMock)
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
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
      const cbbrMock =
        communityBoardBudgetRequestRepositoryMock.findByIdMocks[0];

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

      const cbbrMock =
        communityBoardBudgetRequestRepositoryMock.findByIdMocks[0];

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

    it("should 200 when finding cbbrs by communityDistrictId", async () => {
      const communityDistrict = communityDistrictRepositoryMock.districts[0];
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?communityDistrictId=${communityDistrict.boroughId}${communityDistrict.id}`,
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
      const cityCouncilDistrict =
        cityCouncilDistrictRepositoryMock.districts[0];
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cityCouncilDistrictId=${cityCouncilDistrict.id}`,
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
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0].id;
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
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0].id;
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
      const agency = agencyRepositoryMock.agencies[0];

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?agencyInitials=${agency.initials}`,
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
      const cbbrType = "C";
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

    it("should 200 when finding cbbrs by cbbrAgencyCategoryResponseIds", async () => {
      const cbbrAgencyCategoryResponseIds = [
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[0].id,
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[1].id,
      ];

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrAgencyCategoryResponseIds=${cbbrAgencyCategoryResponseIds.join()}`,
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

    it("should 400 when finding cbbrs by a missing communityDistrictId", async () => {
      const communityDistrictId = "909";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?communityDistrictId=${communityDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
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

    it("should 400 when finding cbbrs by a missing cityCouncilDistrictId", async () => {
      const cityCouncilDistrictId = "90";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cityCouncilDistrictId=${cityCouncilDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
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

    it("should 400 when finding cbbrs by a missing cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId = 20;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
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

    it("should 400 when finding cbbrs by a missing cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId = 20;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid/missing agencyInitials", async () => {
      const agencyInitials = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?agencyInitials=${agencyInitials}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
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

    it("should 400 when finding cbbrs by an invalid cbbrAgencyCategoryResponseIds", async () => {
      const cbbrAgencyCategoryResponseIds = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrAgencyCategoryResponseIds=${cbbrAgencyCategoryResponseIds}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrAgencyCategoryResponseIds: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by a missing cbbrAgencyCategoryResponseIds", async () => {
      const cbbrAgencyCategoryResponseIds = [12, 13];

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?cbbrAgencyCategoryResponseIds=${cbbrAgencyCategoryResponseIds.join()}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
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

    it("should 400 when finding cbbrs by isMapped and geographic filters", async () => {
      const isMapped = false;
      const cityCouncilDistrict =
        cityCouncilDistrictRepositoryMock.districts[0];
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests?isMapped=${isMapped}&cityCouncilDistrictId=${cityCouncilDistrict.id}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /cannot have isMapped filter in conjunction with other geographic filter/,
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

  describe("findTiles", () => {
    it("should return pbf files when passing valid viewport", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${z}/${x}/${y}.pbf`)
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 when finding a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${z}/${x}/${y}.pbf`)
        .expect(400);

      expect(response.body.message).toMatch(/z: Expected number/);
      expect(response.body.message).toMatch(/x: Expected number/);
      expect(response.body.message).toMatch(/y: Expected number/);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findTiles")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${z}/${x}/${y}.pbf`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findGeoJsonById", () => {
    it("should 200 and return a community board budget request with budget details", async () => {
      const communityBoardBudgetRequestGeoJsonMock =
        communityBoardBudgetRequestRepositoryMock.findGeoJsonByIdMock[0];
      const { id } = communityBoardBudgetRequestGeoJsonMock;
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${id}/geojson`)
        .expect(200);

      expect(() =>
        findCommunityBoardBudgetRequestGeoJsonByIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 404 when finding by missing community board budget request id", async () => {
      const communityBoardBudgetRequestId = "1234XYZ";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/${communityBoardBudgetRequestId}/geojson`,
        )
        .expect(404);

      expect(response.body.message).toMatch(/community board budget request/);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findGeoJsonById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const communityBoardBudgetRequestMock =
        communityBoardBudgetRequestRepositoryMock.findGeoJsonByIdMock[0];
      const { id } = communityBoardBudgetRequestMock;
      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/${id}/geojson`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCsv", () => {
    it("should 200 and return a csv", async () => {
      await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv`)
        .expect(200);
    });

    it("should 200 when finding cbbrs by communityDistrictId", async () => {
      const communityDistrict = communityDistrictRepositoryMock.districts[0];
      await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?communityDistrictId=${communityDistrict.boroughId}${communityDistrict.id}`,
        )
        .expect(200);
    });

    it("should 200 when finding cbbrs by cityCouncilDistrictId", async () => {
      const cityCouncilDistrict =
        cityCouncilDistrictRepositoryMock.districts[0];
      await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cityCouncilDistrictId=${cityCouncilDistrict.id}`,
        )
        .expect(200);
    });

    it("should 200 when finding cbbrs by cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId =
        communityBoardBudgetRequestRepositoryMock.policyAreaMocks[0].id;
      await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(200);
    });

    it("should 200 when finding cbbrs by cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId =
        communityBoardBudgetRequestRepositoryMock.needGroupMocks[0].id;
      await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(200);
    });

    it("should 200 when finding cbbrs by agencyInitials", async () => {
      const agency = agencyRepositoryMock.agencies[0];

      await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?agencyInitials=${agency.initials}`,
        )
        .expect(200);
    });

    it("should 200 when finding cbbrs by cbbrType", async () => {
      const cbbrType = "C";
      await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv?cbbrType=${cbbrType}`)
        .expect(200);
    });

    it("should 200 when finding cbbrs by cbbrAgencyCategoryResponseIds", async () => {
      const cbbrAgencyCategoryResponseIds = [
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[0].id,
        communityBoardBudgetRequestRepositoryMock
          .agencyCategoryResponsesMocks[1].id,
      ];

      await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrAgencyCategoryResponseIds=${cbbrAgencyCategoryResponseIds.join()}`,
        )
        .expect(200);
    });

    it("should 200 when finding cbbrs by isMapped", async () => {
      await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv?isMapped=true`)
        .expect(200);
    });

    it("should 200 when finding cbbrs by isContinuedSupport", async () => {
      await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv?isContinuedSupport=true`)
        .expect(200);
    });

    it("should 400 when finding cbbrs by an invalid communityDistrictId", async () => {
      const communityDistrictId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?communityDistrictId=${communityDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: communityDistrictId: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by a missing communityDistrictId", async () => {
      const communityDistrictId = "909";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?communityDistrictId=${communityDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cityCouncilDistrictId", async () => {
      const cityCouncilDistrictId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cityCouncilDistrictId=${cityCouncilDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cityCouncilDistrictId: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by a missing cityCouncilDistrictId", async () => {
      const cityCouncilDistrictId = "90";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cityCouncilDistrictId=${cityCouncilDistrictId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrPolicyAreaId: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by a missing cbbrPolicyAreaId", async () => {
      const cbbrPolicyAreaId = 20;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrPolicyAreaId=${cbbrPolicyAreaId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrNeedGroupId: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by a missing cbbrNeedGroupId", async () => {
      const cbbrNeedGroupId = 20;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrNeedGroupId=${cbbrNeedGroupId}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid/missing agencyInitials", async () => {
      const agencyInitials = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?agencyInitials=${agencyInitials}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrType", async () => {
      const cbbrType = false;

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv?cbbrType=${cbbrType}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrType: Invalid/,
      );
    });

    it("should 400 when finding cbbrs by an invalid cbbrAgencyCategoryResponseIds", async () => {
      const cbbrAgencyCategoryResponseIds = false;

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrAgencyCategoryResponseIds=${cbbrAgencyCategoryResponseIds}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: cbbrAgencyCategoryResponseIds: Expected number, received nan/,
      );
    });

    it("should 400 when finding cbbrs by a missing cbbrAgencyCategoryResponseIds", async () => {
      const cbbrAgencyCategoryResponseIds = [12, 13];

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?cbbrAgencyCategoryResponseIds=${cbbrAgencyCategoryResponseIds.join()}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /one or more values for parameters do not exist/,
      );
    });

    it("should 400 when finding cbbrs by an invalid isMapped", async () => {
      const isMapped = "maybe";

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv?isMapped=${isMapped}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /Invalid request parameter: invalid value for boolean schema property/,
      );
    });

    it("should 400 when finding cbbrs by isMapped and geographic filters", async () => {
      const isMapped = false;
      const cityCouncilDistrict =
        cityCouncilDistrictRepositoryMock.districts[0];
      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?isMapped=${isMapped}&cityCouncilDistrictId=${cityCouncilDistrict.id}`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
      expect(response.body.message).toMatch(
        /cannot have isMapped filter in conjunction with other geographic filter/,
      );
    });

    it("should 400 when finding cbbrs by an invalid isContinuedSupport", async () => {
      const isContinuedSupport = "maybe";

      const response = await request(app.getHttpServer())
        .get(
          `/community-board-budget-requests/csv?isContinuedSupport=${isContinuedSupport}`,
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
        .spyOn(communityBoardBudgetRequestRepositoryMock, "findCsv")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/community-board-budget-requests/csv`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
