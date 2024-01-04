import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { BoroughModule } from "src/borough/borough.module";
// import { BoroughService } from "src/borough/borough.service";
import { BoroughRepository } from "src/borough/borough.repository";
import { DataRetrievalException } from "src/exception";

describe("Boroughs", () => {
  let app: INestApplication;
  // let boroughService = { findAll: () => ['test'] }
  const boroughRepo = { findAll: () => ["test"] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BoroughModule],
    })
      // .overrideProvider(BoroughService)
      // .useValue(boroughService)
      .overrideProvider(BoroughRepository)
      .useValue(boroughRepo)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  it("/GET boroughs", () => {
    return request(app.getHttpServer())
      .get("/boroughs")
      .expect(200)
      .expect({
        boroughs: ["test"],
      });
  });

  it("/GET boroughs exception", () => {
    jest.spyOn(boroughRepo, "findAll").mockImplementationOnce(() => {
      throw new DataRetrievalException();
    });
    return request(app.getHttpServer()).get("/boroughs").expect(500);
  });

  afterAll(async () => {
    await app.close();
  });
});
