import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";
import { Test } from "@nestjs/testing";
import { AgencyRepository } from "src/agency/agency.repository";
import { findAgenciesQueryResponseSchema } from "src/gen";
import { AgencyService } from "./agency.service";

describe("Agency service unit", () => {
  let agencyService: AgencyService;

  beforeEach(async () => {
    const agencyRepositoryMock = new AgencyRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [AgencyService, AgencyRepository],
    })
      .overrideProvider(AgencyRepository)
      .useValue(agencyRepositoryMock)
      .compile();

    agencyService = moduleRef.get<AgencyService>(AgencyService);
  });

  it("service should return a findAgenciesQueryResponseSchema compliant object", async () => {
    const agencies = await agencyService.findMany();
    expect(() => findAgenciesQueryResponseSchema.parse(agencies)).not.toThrow();

    expect(agencies.order).toBe("initials");
  });
});
