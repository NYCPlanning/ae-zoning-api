import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import { CapitalProjectService } from "./capital-project.service";
import { Test } from "@nestjs/testing";
import { CapitalProjectRepository } from "./capital-project.repository";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import {
  findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectManagingAgenciesQueryResponseSchema,
  findCapitalProjectsQueryResponseSchema,
} from "src/gen";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { findTilesRepoSchema } from "./capital-project.repository.schema";

describe("CapitalProjectService", () => {
  let capitalProjectService: CapitalProjectService;
  const agencyBudgetRepositoryMock = new AgencyBudgetRepositoryMock();

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );
  const capitalProjectRepository = new CapitalProjectRepositoryMock(
    agencyRepositoryMock,
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
    agencyBudgetRepositoryMock,
  );

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CapitalProjectService,
        CapitalProjectRepository,
        CityCouncilDistrictRepository,
        CommunityDistrictRepository,
        AgencyRepository,
        AgencyBudgetRepository,
      ],
    })
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepository)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepositoryMock)
      .compile();

    capitalProjectService = moduleRef.get<CapitalProjectService>(
      CapitalProjectService,
    );
  });

  describe("findMany", () => {
    it("should return a list of capital projects", async () => {
      const capitalProjectsResponse = await capitalProjectService.findMany({});
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjectsResponse),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        capitalProjectsResponse,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(9);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.totalProjects).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a list of capital projects by city council district id, using the default limit and offset", async () => {
      const { id } = cityCouncilDistrictRepositoryMock.districts[0];

      const resource = await capitalProjectService.findMany({
        cityCouncilDistrictId: id,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.totalProjects).toBe(
        parsedResource.capitalProjects.length,
      );
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when a city council district with the given id cannot be found", async () => {
      const id = "60";

      expect(
        capitalProjectService.findMany({
          cityCouncilDistrictId: id,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return a list of capital projects by borough id, using the user specified limit and offset", async () => {
      const { boroughId } =
        boroughRepositoryMock.communityDistrictRepoMock.districts[0];
      const capitalProjects = await capitalProjectService.findMany({
        boroughId,
        limit: 10,
        offset: 3,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjects),
      ).not.toThrow();

      const parsedBody =
        findCapitalProjectsQueryResponseSchema.parse(capitalProjects);
      expect(parsedBody.limit).toBe(10);
      expect(parsedBody.offset).toBe(3);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.capitalProjects.length).toBe(0);
      expect(parsedBody.totalProjects).toBe(2);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a list of capital projects by borough id and community district id, using the user specified limit and offset", async () => {
      const { boroughId, id: communityDistrictId } =
        boroughRepositoryMock.communityDistrictRepoMock.districts[0];
      const capitalProjects = await capitalProjectService.findMany({
        boroughId,
        communityDistrictId,
        limit: 10,
        offset: 3,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjects),
      ).not.toThrow();

      const parsedBody =
        findCapitalProjectsQueryResponseSchema.parse(capitalProjects);
      expect(parsedBody.limit).toBe(10);
      expect(parsedBody.offset).toBe(3);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.capitalProjects.length).toBe(0);
      expect(parsedBody.totalProjects).toBe(2);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should filter by an agency budget code", async () => {
      const agencyBudget =
        capitalProjectRepository.agencyBudgetRepositoryMock.agencyBudgets[1]
          .code;
      const capitalProjectsResponse = await capitalProjectService.findMany({
        agencyBudget: agencyBudget,
      });
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjectsResponse),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        capitalProjectsResponse,
      );
      expect(parsedBody.capitalProjects.length).toBe(7);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.totalProjects).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when a borough with the given id cannot be found", async () => {
      const boroughId = "99";

      expect(capitalProjectService.findMany({ boroughId })).rejects.toThrow(
        InvalidRequestParameterException,
      );
    });

    it("should return a InvalidRequestParameterException error when a community district with the given id cannot be found", async () => {
      const boroughId = "1";
      const communityDistrictId = "99";

      expect(
        capitalProjectService.findMany({
          boroughId,
          communityDistrictId,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("service should return a list of capital projects by managing agency, using the default limit and offset", async () => {
      const { initials } = capitalProjectRepository.agencyRepoMock.agencies[0];
      const resource = await capitalProjectService.findMany({
        managingAgency: initials,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.capitalProjects.length).toBe(2);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.totalProjects).toBe(
        parsedResource.capitalProjects.length,
      );
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when a managing agency with the given id cannot be found", async () => {
      const managingAgency = "DNE";

      expect(
        capitalProjectService.findMany({
          managingAgency,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("service should return a list of capital projects with total commitments above the minimum, using the default limit and offset", async () => {
      const commitmentsTotalMin = "0";
      const resource = await capitalProjectService.findMany({
        commitmentsTotalMin,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.capitalProjects.length).toBe(9);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.totalProjects).toBe(
        parsedResource.capitalProjects.length,
      );
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("service should return a list of capital projects with total commitments below the maximum, using the default limit and offset", async () => {
      const commitmentsTotalMax = "10000000000";
      const resource = await capitalProjectService.findMany({
        commitmentsTotalMax,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.capitalProjects.length).toBe(9);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.totalProjects).toBe(
        parsedResource.capitalProjects.length,
      );
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when the maximum total commitments is less than the minimum", async () => {
      const commitmentsTotalMin = "10000000000";
      const commitmentsTotalMax = "0";

      expect(
        capitalProjectService.findMany({
          commitmentsTotalMin,
          commitmentsTotalMax,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should throw an error when requesting an agency budget that does not exist", async () => {
      const missingAgencyBudget = "hr";

      expect(() =>
        capitalProjectService.findMany({
          agencyBudget: missingAgencyBudget,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return both mapped and unmapped capital projects when no isMapped value is provided", async () => {
      const capitalProjectsResponse = await capitalProjectService.findMany({});
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjectsResponse),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        capitalProjectsResponse,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(9);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.totalProjects).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return only capital projects with non-null geometries when isMapped is true", async () => {
      const capitalProjectsResponse = await capitalProjectService.findMany({
        isMapped: true,
      });
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjectsResponse),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        capitalProjectsResponse,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(4);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.totalProjects).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return only capital projects with null geometries when isMapped is false", async () => {
      const capitalProjectsResponse = await capitalProjectService.findMany({
        isMapped: false,
      });
      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(capitalProjectsResponse),
      ).not.toThrow();

      const parsedBody = findCapitalProjectsQueryResponseSchema.parse(
        capitalProjectsResponse,
      );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
      expect(parsedBody.capitalProjects.length).toBe(5);
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.totalProjects).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when both a city council district id and isMapped are provided", async () => {
      expect(
        capitalProjectService.findMany({
          cityCouncilDistrictId: "50",
          isMapped: true,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("should return a InvalidRequestParameterException error when a borough id,  a community district id, and isMapped are provided", async () => {
      expect(
        capitalProjectService.findMany({
          boroughId: "1",
          communityDistrictId: "01",
          isMapped: true,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });
  });

  describe("findByManagingCodeCapitalProjectId", () => {
    it("should return a capital project with budget details", async () => {
      const capitalProjectMock =
        capitalProjectRepository.findByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const capitalProject =
        await capitalProjectService.findByManagingCodeCapitalProjectId({
          managingCode,
          capitalProjectId,
        });

      expect(() =>
        findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          capitalProject,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const missingManagingCode = "890";
      const missingCapitalProjectId = "ABCD";

      expect(
        capitalProjectService.findByManagingCodeCapitalProjectId({
          managingCode: missingManagingCode,
          capitalProjectId: missingCapitalProjectId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findManagingAgencies", () => {
    it("should return capital project managing agencies", async () => {
      const response = await capitalProjectService.findManagingAgencies();
      expect(() =>
        findCapitalProjectManagingAgenciesQueryResponseSchema.parse(response),
      ).not.toThrow();
    });
  });

  describe("findGeoJsonByManagingCodeCapitalProjectId", () => {
    it("should return a capital project geojson with a valid request", async () => {
      const capitalProjectGeoJsonMock =
        capitalProjectRepository
          .findGeoJsonByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectGeoJsonMock;
      const capitalProjectGeoJson =
        await capitalProjectService.findGeoJsonByManagingCodeCapitalProjectId({
          managingCode,
          capitalProjectId,
        });

      expect(() =>
        findCapitalProjectGeoJsonByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          capitalProjectGeoJson,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const missingManagingCode = "890";
      const missingCapitalProjectId = "ABCD";

      expect(
        capitalProjectService.findGeoJsonByManagingCodeCapitalProjectId({
          managingCode: missingManagingCode,
          capitalProjectId: missingCapitalProjectId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await capitalProjectService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() => findTilesRepoSchema.parse(mvt)).not.toThrow();
    });
  });

  describe("findCapitalCommitmentsByManagingCodeCapitalProjectId", () => {
    it("should return capital commitments for a capital project", async () => {
      const { id: capitalProjectId, managingCode } =
        capitalProjectRepository.capitalProjectGroups[0][0];
      const result =
        await capitalProjectService.findCapitalCommitmentsByManagingCodeCapitalProjectId(
          { capitalProjectId, managingCode },
        );

      expect(() =>
        findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          result,
        ),
      ).not.toThrow();

      expect(result.order).toBe("plannedDate");
    });

    it("should throw a resource error when requesting a missing project", async () => {
      const missingManagingCode = "725";
      const missingCapitalProjectId = "JIRO";

      expect(
        capitalProjectService.findCapitalCommitmentsByManagingCodeCapitalProjectId(
          {
            managingCode: missingManagingCode,
            capitalProjectId: missingCapitalProjectId,
          },
        ),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
