import { Test } from "@nestjs/testing";
import { CapitalCommitmentTypeService } from "./capital-commitment.service";
import { findCapitalCommitmentTypesQueryResponseSchema } from "src/gen";
import { CapitalCommitmentTypeRepository } from "./capital-commitment-type.repository";
import { CapitalCommitmentTypeRepositoryMock } from "test/capital-commitment-type/capital-commitment-type.repository.mock";

describe("Capital commitment type service unit", () => {
  let capitalCommitmentTypeService: CapitalCommitmentTypeService;

  beforeEach(async () => {
    const capitalCommitmentTypeRepositoryMock =
      new CapitalCommitmentTypeRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CapitalCommitmentTypeService,
        CapitalCommitmentTypeRepository,
      ],
    })
      .overrideProvider(CapitalCommitmentTypeRepository)
      .useValue(capitalCommitmentTypeRepositoryMock)
      .compile();

    capitalCommitmentTypeService = moduleRef.get<CapitalCommitmentTypeService>(
      CapitalCommitmentTypeService,
    );
  });

  it("service should return a findCapitalCommitmentTypesQueryResponseSchema compliant object", async () => {
    const capitalCommitmentTypes =
      await capitalCommitmentTypeService.findMany();
    expect(() =>
      findCapitalCommitmentTypesQueryResponseSchema.parse(
        capitalCommitmentTypes,
      ),
    ).not.toThrow();
  });
});
