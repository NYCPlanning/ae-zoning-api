import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { LandUseRepositoryMock } from "./land-use.repository.mock";
import { LandUseModule } from "src/land-use/land-use.module";
import { LandUseRepository } from "src/land-use/land-use.repository";
import { findLandUsesQueryResponseSchema } from "src/gen";

describe("Land Use e2e", () => {
  let app: INestApplication;

  const landUseRepositoryMock = new LandUseRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LandUseModule],
    })
      .overrideProvider(LandUseRepository)
      .useValue(landUseRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findLandUses", () => {
    it("should 200 and return a list of all land uses", async () => {
      const response = await request(app.getHttpServer())
        .get(`/land-uses`)
        .expect(200);
      expect(() =>
        findLandUsesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 and return a list of all land uses", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(landUseRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/land-uses`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
