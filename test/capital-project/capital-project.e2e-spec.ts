import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CapitalProjectModule } from "src/capital-project/capital-project.module";
import { CapitalProjectRepository } from "src/capital-project/capital-project.repository";
import { CapitalProjectRepositoryMock } from "./capital-project.repository.mock";
import * as request from "supertest";
import { HttpName } from "src/filter";
import {
  DataRetrievalException,
  InvalidRequestParameterException,
} from "src/exception";

describe("Capital Projects", () => {
  let app: INestApplication;

  const capitalProjectRepository = new CapitalProjectRepositoryMock();
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapitalProjectModule],
    })
      .overrideProvider(CapitalProjectRepository)
      .useValue(capitalProjectRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("findFills", () => {
    it("should return pbf files when passing valid viewport", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect("Content-Type", "application/x-protobuf; charset=utf-8")
        .expect(200);
    });

    it("should 400 when finding a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect(400);

      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(capitalProjectRepository, "findTiles")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });
});
