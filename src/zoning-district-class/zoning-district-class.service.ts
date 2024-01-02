import { Inject, Injectable } from "@nestjs/common";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictClassRepo } from "./zoning-district-class.repo";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @Inject(ZoningDistrictClassRepo)
    private readonly zoningDistrictClassRepo: ZoningDistrictClassRepo,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findAllZoningDistrictClasses() {
    if (this.featureFlagConfig.useDrizzle) {
      const zoningDistrictClasses =
        await this.zoningDistrictClassRepo.findAll();
      return {
        zoningDistrictClasses,
      };
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }

  async findZoningDistrictClassById(id: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const result = this.zoningDistrictClassRepo.findById(id);
      if (result === undefined) throw new ResourceNotFoundException();

      return result;
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }

  async findZoningDistrictClassCategoryColors() {
    if (this.featureFlagConfig.useDrizzle) {
      const zoningDistrictClassCategoryColors =
        await this.zoningDistrictClassRepo.findCategoryColors();

      return {
        zoningDistrictClassCategoryColors,
      };
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }
}
