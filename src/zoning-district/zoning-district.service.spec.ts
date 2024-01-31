import { ZoningDistrictRepositoryMock } from "test/zoning-district/zoning-district.repository.mock";
import { ZoningDistrictService } from "./zoning-district.service";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { Test } from "@nestjs/testing";
import { ResourceNotFoundException } from "src/exception";
import {
  findZoningDistrictByZoningDistrictIdQueryResponseSchema,
  findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema,
} from "src/gen";

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

  describe("findById", () => {
    it("service should return a zoning district compliant object", async () => {
      const mock = zoningDistrictRepositoryMock.findByIdMocks[0];
      const zoningDistrict = await zoningDistrictService.findById(mock.id);
      expect(() =>
        findZoningDistrictByZoningDistrictIdQueryResponseSchema.parse(
          zoningDistrict,
        ),
      ).not.toThrow();
    });

    it("service should throw a resource error when requesting with a missing id", async () => {
      const missingUuid = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
      const zoningDistrict = zoningDistrictService.findById(missingUuid);
      expect(zoningDistrict).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("findZoningDistrictClassesById", () => {
    it("service should return a zoning district classes compliant object", async () => {
      const { id } = zoningDistrictRepositoryMock.checkByIdMocks[0];
      const zoningDistrictClasses =
        await zoningDistrictService.findZoningDistrictClassesById(id);
      expect(() =>
        findZoningDistrictClassesByZoningDistrictIdQueryResponseSchema.parse(
          zoningDistrictClasses,
        ),
      ).not.toThrow();
    });

    it("service should throw a resource error when requesting with a missing id", async () => {
      const missingUuid = "03a40e74-e5b4-4faf-a8cb-a93cf6118d6c";
      const zoningDistrict =
        zoningDistrictService.findZoningDistrictClassesById(missingUuid);
      expect(zoningDistrict).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
