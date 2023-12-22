import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictRepo } from "./zoning-district.repo";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @InjectRepository(ZoningDistrict)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,

    @Inject(ZoningDistrictRepo)
    private readonly zoningDistrictRepo: ZoningDistrictRepo,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findZoningDistrictByUuid(uuid: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const zoningDistrict = await this.zoningDistrictRepo.findByUuid(uuid);
      if (zoningDistrict === undefined) throw new ResourceNotFoundException();

      return zoningDistrict;
    } else {
      return this.zoningDistrictRepository.findOne(uuid, {
        fields: ["id", "label"],
      });
    }
  }

  async findClassesByZoningDistrictUuid(id: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const zoningDistrictCheck =
        await this.zoningDistrictRepo.checkZoningDistrictById(id);
      if (zoningDistrictCheck === undefined)
        throw new ResourceNotFoundException();
      const zoningDistrictClasses =
        await this.zoningDistrictRepo.findClassesByUuid(id);

      return {
        zoningDistrictClasses,
      };
    } else {
      throw new Error(
        "Zoning District Classes route not supported in Mikro ORM",
      );
    }
  }
}
