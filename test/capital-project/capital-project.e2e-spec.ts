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
import {
  findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema,
  findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema,
} from "src/gen";

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

  describe("findByManagingCodeCapitalProjectId", () => {
    it("should 200 and return a capital project with budget details", async () => {
      const capitalProjectMock =
        capitalProjectRepository.findByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}`)
        .expect(200);

      expect(() =>
        findCapitalProjectByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by a too long managing code", async () => {
      const tooLongManagingCode = "1234";
      const capitalProjectId = "ABCD";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${tooLongManagingCode}/${capitalProjectId}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a lettered managing code", async () => {
      const letteredManagingCode = "ABC";
      const capitalProjectId = "ABCD";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${letteredManagingCode}/${capitalProjectId}`)
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing managing code and capital project id", async () => {
      const managingCode = "123";
      const capitalProjectId = "ABCD";

      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}`)
        .expect(404);

      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(capitalProjectRepository, "findByManagingCodeCapitalProjectId")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const capitalProjectMock =
        capitalProjectRepository.findByManagingCodeCapitalProjectIdMock[0];
      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(`/capital-projects/${managingCode}/${capitalProjectId}`)
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });

  describe("findFills", () => {
    it("should return pbf files when passing valid viewport", async () => {
      const z = 1;
      const x = 100;
      const y = 200;
      await request(app.getHttpServer())
        .get(`/capital-projects/${z}/${x}/${y}.pbf`)
        .expect("Content-Type", "application/x-protobuf")
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

  describe("findCapitalCommitmentsByManagingCodeCapitalProjectId", () => {
    it("should 200 and return an array of capital commitments", async () => {
      const capitalProjectMock =
        capitalProjectRepository.checkByManagingCodeCapitalProjectIdMocks[0];

      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${managingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(200);

      expect(() =>
        findCapitalCommitmentsByManagingCodeCapitalProjectIdQueryResponseSchema.parse(
          response.body,
        ),
      ).not.toThrow();
    });

    it("should 400 when finding by a too long managing code", async () => {
      const tooLongManagingCode = "0725";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${tooLongManagingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 400 when finding by a lettered managing code", async () => {
      const letteredManagingCode = "FUJI";
      const capitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${letteredManagingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(400);

      expect(response.body.error).toBe(HttpName.BAD_REQUEST);
    });

    it("should 404 when finding by missing managing code and capital project id", async () => {
      const missingManagingCode = "567";
      const missingCapitalProjectId = "JIRO";

      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${missingManagingCode}/${missingCapitalProjectId}/capital-commitments`,
        )
        .expect(404);

      expect(response.body.message).toBe(HttpName.NOT_FOUND);
    });

    it("should 500 when the database errors", async () => {
      const dataRetrievalException = new DataRetrievalException();
      jest
        .spyOn(
          capitalProjectRepository,
          "findCapitalCommitmentsByManagingCodeCapitalProjectId",
        )
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const capitalProjectMock =
        capitalProjectRepository.checkByManagingCodeCapitalProjectIdMocks[0];

      const { managingCode, id: capitalProjectId } = capitalProjectMock;
      const response = await request(app.getHttpServer())
        .get(
          `/capital-projects/${managingCode}/${capitalProjectId}/capital-commitments`,
        )
        .expect(500);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
      expect(response.body.message).toBe(dataRetrievalException.message);
    });
  });
});
