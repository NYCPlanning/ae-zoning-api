import { Test } from "@nestjs/testing";
import { ZoningDistrictClassRepositoryMock } from "test/zoning-district-class/zoning-district-class.repository.mock";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";
import {
  getAllZoningDistrictClassesQueryResponseSchema,
  getZoningDistrictClassesByIdQueryResponseSchema,
  getZoningDistrictClassCategoryColorsQueryResponseSchema,
} from "src/gen";
import { ResourceNotFoundException } from "src/exception";

describe("zoning district class service unit", () => {
  let zoningDistrictClassService: ZoningDistrictClassService;
  const zoningDistrictClassRepositoryMock =
    new ZoningDistrictClassRepositoryMock();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ZoningDistrictClassService, ZoningDistrictClassRepository],
    })
      .overrideProvider(ZoningDistrictClassRepository)
      .useValue(zoningDistrictClassRepositoryMock)
      .compile();

    zoningDistrictClassService = moduleRef.get<ZoningDistrictClassService>(
      ZoningDistrictClassService,
    );
  });

  describe("getAllZoningDistrictClasses", () => {
    it("should return zoning district classes", async () => {
      const zoningDistrictClasses =
        await zoningDistrictClassService.findAllZoningDistrictClasses();
      expect(() =>
        getAllZoningDistrictClassesQueryResponseSchema.parse(
          zoningDistrictClasses,
        ),
      ).not.toThrow();
    });
  });

  describe("getZoningDistrictClassesById", () => {
    it("should return a zoning district class by id", async () => {
      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];
      const zoningDistrictClassesById =
        await zoningDistrictClassService.findZoningDistrictClassById(mock.id);
      expect(() =>
        getZoningDistrictClassesByIdQueryResponseSchema.parse(
          zoningDistrictClassesById,
        ),
      ).not.toThrow();
    });

    it("service should throw 'Resource Not Found' if the id is missing", async () => {
      const missingId = "C1";
      expect(
        zoningDistrictClassService.findZoningDistrictClassById(missingId),
      ).rejects.toThrow(ResourceNotFoundException);
    });
  });

  describe("getZoningDistrictClassesCategoryColors", () => {
    it("should return an array of zoning district class category colors", async () => {
      const zoningDistrictClassCategoryColors =
        await zoningDistrictClassService.findZoningDistrictClassCategoryColors();

      expect(() =>
        getZoningDistrictClassCategoryColorsQueryResponseSchema.parse(
          zoningDistrictClassCategoryColors,
        ),
      ).not.toThrow();
    });
  });
});
