import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { BoroughRepositoryMock } from "test/borough/borough.repository.mock";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
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
  findCapitalProjectTilesQueryResponseSchema,
  findCapitalProjectsQueryResponseSchema,
} from "src/gen";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";

describe("CapitalProjectService", () => {
  let capitalProjectService: CapitalProjectService;

  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const boroughRepositoryMock = new BoroughRepositoryMock(
    communityDistrictRepositoryMock,
  );
  const capitalProjectRepository = new CapitalProjectRepositoryMock(
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
  );
  const agencyRepositoryMock = new AgencyRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CapitalProjectService,
        CapitalProjectRepository,
        CityCouncilDistrictRepository,
        CommunityDistrictRepository,
        AgencyRepository,
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
      expect(parsedBody.total).toBe(parsedBody.capitalProjects.length);
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a list of capital projects by city council district id, using the default limit and offset", async () => {
      const { id } =
        cityCouncilDistrictRepositoryMock.checkCityCouncilDistrictByIdMocks[0];

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

    it("should return a list of capital projects by community district id, using the user specified limit and offset", async () => {
      const { boroughId, id: communityDistrictId } =
        boroughRepositoryMock.communityDistrictRepoMock
          .checkByBoroughIdCommunityDistrictIdMocks[0];
      const capitalProjects = await capitalProjectService.findMany({
        communityDistrictCombinedId: `${boroughId}${communityDistrictId}`,
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
      expect(parsedBody.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when a community district with the given id cannot be found", async () => {
      const id = "999";

      expect(
        capitalProjectService.findMany({
          communityDistrictCombinedId: id,
        }),
      ).rejects.toThrow(InvalidRequestParameterException);
    });

    it("service should return a list of capital projects by managing agency, using the default limit and offset", async () => {
      const managingAgency = "super";
      const resource = await capitalProjectService.findMany({
        managingAgency,
      });

      expect(() =>
        findCapitalProjectsQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("should return a InvalidRequestParameterException error when a managing agency with the given id cannot be found", async () => {
      const managingAgency = "999";

      expect(
        capitalProjectService.findMany({
          managingAgency,
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
      expect(() =>
        findCapitalProjectTilesQueryResponseSchema.parse(mvt),
      ).not.toThrow();
    });
  });

  describe("findCapitalCommitmentsByManagingCodeCapitalProjectId", () => {
    it("should return capital commitments for a capital project", async () => {
      const { id: capitalProjectId, managingCode } =
        capitalProjectRepository.checkByManagingCodeCapitalProjectIdMocks[0];
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
