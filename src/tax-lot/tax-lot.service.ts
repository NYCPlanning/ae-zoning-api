import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { DB, DbType } from "src/global/providers/db.provider";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { TaxLotRepo } from "./tax-lot.repo";
import { ResourceNotFoundException } from "src/exception";
import { MultiPolygon } from "geojson";

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
      const result = await this.taxLotRepo.findByBbl(bbl);
      if (result === undefined) throw new ResourceNotFoundException();
      return result;
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
      const result = await this.taxLotRepo.findByBblSpatial(bbl);
      if (result === undefined) throw new ResourceNotFoundException();

      const geometry = JSON.parse(result.geometry) as MultiPolygon;

      return {
        type: "Feature",
        id: result.bbl,
        properties: {
          bbl: result.bbl,
          borough: result.borough,
          block: result.block,
          lot: result.lot,
          address: result.address,
          landUse: result.landUse,
        },
        geometry,
      };
    } else {
      return this.taxLotRepository.findOne({ bbl });
    }
  }

  async findZoningDistrictByTaxLotBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const taxLotCheck = await this.taxLotRepo.checkTaxLotByBbl(bbl);
      if (taxLotCheck === undefined) throw new ResourceNotFoundException();
      const zoningDistricts =
        await this.taxLotRepo.findZoningDistrictByBbl(bbl);
      return {
        zoningDistricts,
      };
    } else {
      throw new Error(
        "Zoning district by tax lot bbl route not implemented in Mikro orm",
      );
    }
  }

  async findZoningDistrictClassByTaxLotBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const taxLotCheck = await this.taxLotRepo.checkTaxLotByBbl(bbl);
      if (taxLotCheck === undefined) throw new ResourceNotFoundException();

      const zoningDistrictClasses =
        await this.taxLotRepo.findZoningDistrictClassByBbl(bbl);
      return {
        zoningDistrictClasses,
      };
    } else {
      throw new Error(
        "Zoning district class by tax lot bbl route not implemented in Mikro orm",
      );
    }
  }
}
