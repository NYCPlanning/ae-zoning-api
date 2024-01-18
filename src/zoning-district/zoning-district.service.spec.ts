import { ZoningDistrictRepositoryMock } from "test/zoning-district/zoning-district.repository.mock";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { getZoningDistrictByIdQueryResponseSchema } from "src/gen";
import { Test } from "@nestjs/testing";
import { ResourceNotFoundException } from "src/exception";

describe("Zoning district service unit", () => {
  let zoningDistrictService: ZoningDistrictService;
  const zoningDistrictRepositoryMock = new ZoningDistrictRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ZoningDistrictService, ZoningDistrictRepository],
    })
      .overrideProvider(ZoningDistrictRepository)
      .useValue(zoningDistrictRepositoryMock)
      .compile();

    zoningDistrictService = moduleRef.get<ZoningDistrictService>(
      ZoningDistrictService,
    );
  });

  describe("findByUuid", () => {
    it("service should return a getZoningDistrictByIdQueryResponseSchema compliant object", async () => {
      const mock = zoningDistrictRepositoryMock.findByUuidMocks[0];
      const zoningDistrict =
        await zoningDistrictService.findZoningDistrictByUuid(mock.id);
      expect(() =>
        getZoningDistrictByIdQueryResponseSchema.parse(zoningDistrict),
      ).not.toThrow();
    });

    it("service should throw a resource error when requesting with a missing id", async () => {
      const missingUuid = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
      const zoningDistrict =
        zoningDistrictService.findZoningDistrictByUuid(missingUuid);
      expect(zoningDistrict).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
