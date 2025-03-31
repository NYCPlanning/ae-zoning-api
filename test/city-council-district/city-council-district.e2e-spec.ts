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
import {
  findCapitalProjectsByCityCouncilIdQueryResponseSchema,
  findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponseSchema,
  findCityCouncilDistrictsQueryResponseSchema,
} from "src/gen";
import { CapitalProjectRepositoryMock } from "test/capital-project/capital-project.repository.mock";
import { AgencyBudgetRepositoryMock } from "test/agency-budget/agency-budget.repository.mock";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { CommunityDistrictRepositoryMock } from "test/community-district/community-district.repository.mock";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";

describe("City Council District e2e", () => {
  let app: INestApplication;

  const agencyRepositoryMock = new AgencyRepositoryMock();
  const agencyBudgetRepositoryMock = new AgencyBudgetRepositoryMock();
  const cityCouncilDistrictRepositoryMock =
    new CityCouncilDistrictRepositoryMock();
  const communityDistrictRepositoryMock = new CommunityDistrictRepositoryMock();
  const capitalProjectRepositoryMock = new CapitalProjectRepositoryMock(
    agencyRepositoryMock,
    cityCouncilDistrictRepositoryMock,
    communityDistrictRepositoryMock,
    agencyBudgetRepositoryMock,
  );

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CityCouncilDistrictModule],
    })
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepositoryMock)
      .overrideProvider(CityCouncilDistrictRepository)
      .useValue(cityCouncilDistrictRepositoryMock)
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepositoryMock)
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .overrideProvider(AgencyBudgetRepository)
      .useValue(agencyBudgetRepositoryMock)
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

  describe("findCityCouncilDistrictGeoJsonByCityCouncilDistrictId", () => {
    it("should 200 and return documented schema when finding by valid id", async () => {
      const mock = cityCouncilDistrictRepositoryMock.findGeoJsonByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/geojson`)
        .expect(200);
      expect(() =>
        findCityCouncilDistrictGeoJsonByCityCouncilDistrictIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by too long id", async () => {
      const longId = "100";
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${longId}/geojson`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by lettered id", async () => {
      const letterId = "Y";
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${letterId}/geojson`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing id", async () => {
      const missingId = "00";
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${missingId}/geojson`)
        .expect(404);
      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(cityCouncilDistrictRepositoryMock, "findGeoJsonById")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });
      const mock = cityCouncilDistrictRepositoryMock.findGeoJsonByIdMocks[0];
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/geojson`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  describe("findCapitalProjectTilesByCityCouncilDistrictId", () => {
    it("should 200 and return capital project tiles for a given city council district id", async () => {
      const cityCouncilDistrictId = "1";
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(
          `/city-council-districts/${cityCouncilDistrictId}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 and when finding by an invalid city council id", async () => {
      const invalidId = "FOO";

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/city-council-districts/${invalidId}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by a lettered viewport", async () => {
      const cityCouncilDistrictId = "1";
      const z = "foo";
      const x = "bar";
      const y = "baz";
      const response = await request(app.getHttpServer())
        .get(
          `/city-council-districts/${cityCouncilDistrictId}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(400);

      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when the database errors", async () => {
      const cityCouncilDistrictId = "1";
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(
          cityCouncilDistrictRepositoryMock,
          "findCapitalProjectTilesByCityCouncilDistrictId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;
      const response = await request(app.getHttpServer())
        .get(
          `/city-council-districts/${cityCouncilDistrictId}/capital-projects/${z}/${x}/${y}.pbf`,
        )
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findCapitalProjectsByCityCouncilDistrictId", () => {
    const mock = cityCouncilDistrictRepositoryMock.findManyMocks[0];

    it("should 200 amd return all capital projects for a city council district", async () => {
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/capital-projects`)
        .expect(200);
      expect(() =>
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
      const parsedBody =
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(20);
      expect(parsedBody.offset).toBe(0);
    });

    it("should 200 amd return all capital projects for a city council district with user specified offset and limit", async () => {
      const limit = 10;
      const offset = 3;
      const response = await request(app.getHttpServer())
        .get(
          `/city-council-districts/${mock.id}/capital-projects?limit=${limit}&offset=${offset}`,
        )
        .expect(200);
      expect(() =>
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
      const parsedBody =
        findCapitalProjectsByCityCouncilIdQueryResponseSchema.parse(
          response.body,
        );
      expect(parsedBody.limit).toBe(limit);
      expect(parsedBody.offset).toBe(offset);
    });

    it("should 400 and when finding by an invalid id", async () => {
      const invalidId = "MN";
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${invalidId}/capital-projects`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid limit", async () => {
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/capital-projects?limit=b4d`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an 'too-high' limit", async () => {
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/capital-projects?limit=101`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });
    it("should 400 and when finding by an 'too-low' limit", async () => {
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/capital-projects?limit=0`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an invalid offset", async () => {
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${mock.id}/capital-projects?offset=b4d`)
        .expect(400);
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 and when finding by an missing id", async () => {
      const missingId = "10";
      const response = await request(app.getHttpServer())
        .get(`/city-council-districts/${missingId}/capital-projects`)
        .expect(400);
      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );
      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });
  });
});
