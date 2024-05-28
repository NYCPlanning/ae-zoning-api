import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CityCouncilDistrictRepositoryMock } from "./city-council-district.repository.mock";
import { CityCouncilDistrictModule } from "src/city-council-district/city-council-district.module";
import { findCityCouncilDistrictsQueryResponseSchema } from "src/gen";

describe("City Council District e2e", () => {
  let app: INestApplication;

  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CityCouncilDistrictModule],
    })
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findCityCouncilDistricts", () => {
    it("should 200 amd return all city council districts", async () => {
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts`)
        .expect(200);
      expect(() =>
        findCityCouncilDistrictsQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(cityCouncilDistrictRepositoryMock, "findMany")
        .mockImplementation(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/city-council-districts`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });

    afterAll(async () => {
      await app.close();
    });
  });
});
