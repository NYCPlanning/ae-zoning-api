import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { Test } from "@nestjs/testing";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import {
  findCityCouncilDistrictTilesQueryResponseSchema,
  findCapitalProjectsByCityCouncilIdQueryResponseSchema,
  findCityCouncilDistrictsQueryResponseSchema,
  findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponseSchema,
  findCapitalProjectTilesByCityCouncilDistrictIdQueryResponseSchema,
} from "src/gen";
import { CityCouncilDistrictService } from "./city-council-district.service";
import { ResourceNotFoundException } from "src/exception";

describe("City Council District service unit", () => {
  let cityCouncilDistrictService: CityCouncilDistrictService;

  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CityCouncilDistrictService, CityCouncilDistrictRepository],
    })
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .compile();

    cityCouncilDistrictService = moduleRef.get<CityCouncilDistrictService>(
      CityCouncilDistrictService,
    );
  });

  describe("findMany", () => {
    it("service should return a findCityCouncilDistrictsQueryResponseSchema compliant object", async () => {
      const cityCouncilDistricts = await cityCouncilDistrictService.findMany();

      expect(() =>
        findCityCouncilDistrictsQueryResponseSchema.parse(cityCouncilDistricts),
      ).not.toThrow();

      expect(cityCouncilDistricts.order).toBe("id");
    });
  });

  describe("findTiles", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt = await cityCouncilDistrictService.findTiles({
        z: 1,
        x: 1,
        y: 1,
      });
      expect(() =>
        findCityCouncilDistrictTilesQueryResponseSchema.parse(mvt),
      ).not.toThrow();
    });
  });

  describe("findGeoJsonById", () => {
    it("should return a city council district geojson when requesting a valid id", async () => {
      const { id } = cityCouncilDistrictRepositoryMock.findGeoJsonByIdMocks[0];
      const cityCouncilDistrictGeoJson =
        await cityCouncilDistrictService.findGeoJsonById({
          cityCouncilDistrictId: id,
        });
      expect(() =>
        findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponseSchema.parse(
          cityCouncilDistrictGeoJson,
        ),
      ).not.toThrow();
    });

    it("should throw a resource error when requesting a missing id", async () => {
      const missingId = "00";
      expect(
        cityCouncilDistrictService.findGeoJsonById({
          cityCouncilDistrictId: missingId,
        }),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findCapitalProjectTilesByCityCouncilDistrictId", () => {
    it("should return an mvt when requesting coordinates", async () => {
      const mvt =
        await cityCouncilDistrictService.findCapitalProjectTilesByCityCouncilDistrictId(
          {
            cityCouncilDistrictId: "1",
            z: 1,
            x: 1,
            y: 1,
          },
        );
      expect(() =>
        findCapitalProjectTilesByCityCouncilDistrictIdQueryResponseSchema.parse(
          mvt,
        ),
      ).not.toThrow();
    });
  });

  describe("findCapitalProjectsByCityCouncilId", () => {
    it("service should return a list of capital projects by city council district id, using the default limit and offset", async () => {
      const { id } =
        cityCouncilDistrictRepositoryMock.checkCityCouncilDistrictByIdMocks[0];

      const resource = await cityCouncilDistrictService.findCapitalProjectsById(
        {
          cityCouncilDistrictId: id,
        },
      );

      expect(() =>
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("service should return a list of capital projects by city council district id, using the user specified limit and offset", async () => {
      const { id } =
        cityCouncilDistrictRepositoryMock.checkCityCouncilDistrictByIdMocks[0];

      const resource = await cityCouncilDistrictService.findCapitalProjectsById(
        {
          cityCouncilDistrictId: id,
          limit: 10,
          offset: 3,
        },
      );

      expect(() =>
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(10);
      expect(parsedResource.offset).toBe(3);
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });

    it("service should return a list of capital projects by city council district id, using the user specified managing agency", async () => {
      const { id } =
        cityCouncilDistrictRepositoryMock.checkCityCouncilDistrictByIdMocks[0];
      const resource = await cityCouncilDistrictService.findCapitalProjectsById(
        {
          cityCouncilDistrictId: id,
          managingAgency: "acerbitas",
        },
      );

      expect(() =>
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(resource),
      ).not.toThrow();
      const parsedResource =
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(resource);
      expect(parsedResource.limit).toBe(20);
      expect(parsedResource.offset).toBe(0);
      expect(parsedResource.capitalProjects[0].managingAgency).toBe(
        "acerbitas",
      );
      expect(parsedResource.total).toBe(parsedResource.capitalProjects.length);
      expect(parsedResource.order).toBe("managingCode, capitalProjectId");
    });
  });
});
