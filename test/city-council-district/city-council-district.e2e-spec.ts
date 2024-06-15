import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  DataRetrievalException,
  InvalidRequestParameterException,
} from "src/exception";
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

  afterAll(async () => {
    await app.close();
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
  });

  describe("findTiles", () => {
    it("should return pbf files when passing valid viewport", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(`/city-council-districts/${z}/${x}/${y}.pbf`)
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 when finding a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";

      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${z}/${x}/${y}.pbf`)
        .expect(400);

      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(cityCouncilDistrictRepositoryMock, "findTiles")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;

      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${z}/${x}/${y}.pbf`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });
});
