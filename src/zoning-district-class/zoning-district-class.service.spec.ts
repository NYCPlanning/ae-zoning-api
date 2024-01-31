import { Test } from "@nestjs/testing";
import { ZoningDistrictClassRepositoryMock } from "test/zoning-district-class/zoning-district-class.repository.mock";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";
import {
  findZoningDistrictClassesQueryResponseSchema,
  findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema,
  findZoningDistrictClassCategoryColorsQueryResponseSchema,
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

  describe("findMany", () => {
    it("should return zoning district classes", async () => {
      const zoningDistrictClasses = await zoningDistrictClassService.findMany();
      expect(() =>
        findZoningDistrictClassesQueryResponseSchema.parse(
          zoningDistrictClasses,
        ),
      ).not.toThrow();
    });
  });

  describe("findById", () => {
    it("should return a zoning district class by id", async () => {
      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];
      const zoningDistrictClassesById =
        await zoningDistrictClassService.findById(mock.id);
      expect(() =>
        findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema.parse(
          zoningDistrictClassesById,
        ),
      ).not.toThrow();
    });

    it("should return an uppercase class when finding by lowercase", async () => {
      const mock = zoningDistrictClassRepositoryMock.findByIdMocks[0];
      const lowerCaseId = mock.id.toLowerCase();
      const zoningDistrictClassesById =
        await zoningDistrictClassService.findById(lowerCaseId);
      expect(() =>
        findZoningDistrictClassByZoningDistrictClassIdQueryResponseSchema.parse(
          zoningDistrictClassesById,
        ),
      ).not.toThrow();
    });

    it("service should throw 'Resource Not Found' if the id is missing", async () => {
      const missingId = "T1";
      expect(zoningDistrictClassService.findById(missingId)).rejects.toThrow(
        ResourceNotFoundException,
      );
    });
  });

  describe("findCategoryColors", () => {
    it("should return an array of zoning district class category colors", async () => {
      const zoningDistrictClassCategoryColors =
        await zoningDistrictClassService.findCategoryColors();

      expect(() =>
        findZoningDistrictClassCategoryColorsQueryResponseSchema.parse(
          zoningDistrictClassCategoryColors,
        ),
      ).not.toThrow();
    });
  });
});
