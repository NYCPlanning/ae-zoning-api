import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DataRetrievalException } from "src/exception";
import { HttpName } from "src/filter";
import { CapitalCommitmentTypeRepositoryMock } from "./capital-commitment-type.repository.mock";
import { findCapitalCommitmentTypesQueryResponseSchema } from "src/gen";
import { CapitalCommitmentTypeModule } from "src/capital-commitment-type/capital-commitment-type.module";
import { CapitalCommitmentTypeRepository } from "src/capital-commitment-type/capital-commitment-type.repository";

describe("Capital commitment types e2e", () => {
  let app: INestApplication;

  const capitalCommitmentTypeRepositoryMock =
    new CapitalCommitmentTypeRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CapitalCommitmentTypeModule],
    })
      .overrideProvider(CapitalCommitmentTypeRepository)
      .useValue(capitalCommitmentTypeRepositoryMock)
      .compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe("findCapitalCommitmentTypes", () => {
    it("should 200 and return a list of all land uses", async () => {
      const response = await request(app.getHttpServer())
        .get(`/capital-commitment-types`)
        .expect(200);
      expect(() =>
        findCapitalCommitmentTypesQueryResponseSchema.parse(response.body),
      ).not.toThrow();
    });

    it("should 500 and return a list of all capital commitment types", async () => {
      const dataRetrievalException = new DataRetrievalException(
        "cannot find data",
      );
      jest
        .spyOn(capitalCommitmentTypeRepositoryMock, "findMany")
        .mockImplementationOnce(() => {
          throw dataRetrievalException;
        });

      const response = await request(app.getHttpServer())
        .get(`/capital-commitment-types`)
        .expect(500);
      expect(response.body.message).toBe(dataRetrievalException.message);
      expect(response.body.error).toBe(HttpName.INTERNAL_SEVER_ERROR);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
