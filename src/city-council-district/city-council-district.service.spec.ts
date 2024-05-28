import { CityCouncilDistrictRepositoryMock } from "test/city-council-district/city-council-district.repository.mock";
import { Test } from "@nestjs/testing";
import { CityCouncilDistrictRepository } from "./city-council-district.repository";
import { findCityCouncilDistrictsQueryResponseSchema } from "src/gen";
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

  it("service should return a findCityCouncilDistrictsQueryResponseSchema compliant object", async () => {
    const cityCouncilDistricts = await cityCouncilDistrictService.findMany();
    expect(() =>
      findCityCouncilDistrictsQueryResponseSchema.parse(cityCouncilDistricts),
    ).not.toThrow();
  });
});
