import { Test } from "@nestjs/testing";
import { ZoningDistrictClassRepositoryMock } from "test/zoning-district-class/zoning-district-class.repository.mock";
import { ZoningDistrictClassService } from "./zoning-district-class.service";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";
import { getAllZoningDistrictClassesQueryResponseSchema } from "src/gen";

describe("zoning district class service unit", () => {
  let zoningDistrictClassService: ZoningDistrictClassService;

  beforeEach(async () => {
    const zoningDistrictClassRepositoryMock =
      new ZoningDistrictClassRepositoryMock();

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
});
