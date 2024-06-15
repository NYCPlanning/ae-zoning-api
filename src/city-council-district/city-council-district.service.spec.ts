import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { Test } from "@nestjs/testing";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import {
  findCityCouncilDistrictTilesQueryResponseSchema,
  findCityCouncilDistrictsQueryResponseSchema,
} from "src/gen";
import { CityCouncilDistrictService } from "./city-council-district.service";

describe("City Council District service unit", () => {
  let cityCouncilDistrictService: CityCouncilDistrictService;

  beforeEach(async () => {
    const cityCouncilDistrictRepositoryMock =
      new CityCouncilDistrictRepositoryMock();

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
});
