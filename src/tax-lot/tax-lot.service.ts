import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { DB, DbType } from "src/global/providers/db.provider";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { TaxLotRepo } from "./tax-lot.repo";

@Injectable()
export class TaxLotService {
  constructor(
    @InjectRepository(TaxLot)
    private readonly taxLotRepository: TaxLotRepository,

    @Inject(DB)
    private readonly db: DbType,

    @Inject(TaxLotRepo)
    private readonly taxLotRepo: TaxLotRepo,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findTaxLotByBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.taxLotRepo.taxLotByBbl(bbl);
    } else {
      return this.taxLotRepository.findOne(
        { bbl },
        {
          fields: ["bbl", "borough", "landUse", "block", "lot", "address"],
          populate: ["borough", "landUse"],
        },
      );
    }
  }

  async findTaxLotByBblGeoJson(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.taxLotRepo.taxLotByBblGeoJson(bbl);
    } else {
      return this.taxLotRepository.findOne({ bbl });
    }
  }

  async findZoningDistrictByTaxLotBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.taxLotRepo.zoningDistrictByTaxLotBbl(bbl);
    } else {
      throw new Error(
        "Zoning district by tax lot bbl route not implemented in Mikro orm",
      );
    }
  }

  async findZoningDistrictClassByTaxLotBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      return await this.taxLotRepo.zoningDistrictClassByTaxLotBbl(bbl);
    } else {
      throw new Error(
        "Zoning district class by tax lot bbl route not implemented in Mikro orm",
      );
    }
  }
}
