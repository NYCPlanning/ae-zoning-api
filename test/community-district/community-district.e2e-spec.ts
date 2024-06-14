import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CommunityDistrictModule } from "src/community-district/community-district.module";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { CommunityDistrictRepositoryMock } from "./community-district.repository.mock";
import * as request from "supertest";
import { HttpName } from "src/filter";
import {
  DataRetrievalException,
  InvalidRequestParameterException,
} from "src/exception";

describe("Community Districts", () => {
  let app: INestApplication;

  const communityDistrictRepository = new CommunityDistrictRepositoryMock();
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommunityDistrictModule],
    })
      .overrideProvider(CommunityDistrictRepository)
      .useValue(communityDistrictRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("findTiles", () => {
    it("should return pbf files when passing valid viewport", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(`/community-districts/${z}/${x}/${y}.pbf`)
        .expect("Content-Type", "application/x-protobuf")
        .expect(200);
    });

    it("should 400 when finding a lettered viewport", async () => {
      const z = "foo";
      const x = "bar";
      const y = "baz";

      const response = await request(app.getHttpServer())
        .get(`/community-districts/${z}/${x}/${y}.pbf`)
        .expect(400);

      expect(response.body.message).toBe(
        new InvalidRequestParameterException().message,
      );

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 500 when there is a data retrieval error", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(communityDistrictRepository, "findTiles")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const z = 1;
      const x = 100;
      const y = 200;

      const response = await request(app.getHttpServer())
        .get(`/community-districts/${z}/${x}/${y}.pbf`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });
});
