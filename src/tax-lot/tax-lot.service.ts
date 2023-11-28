import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { TaxLotRepo } from "./tax-lot.repo";

@Injectable()
export class TaxLotService {
  constructor(
    @InjectRepository(TaxLot)
    private readonly taxLotRepository: TaxLotRepository,

    @Inject(TaxLotRepo)
    private readonly taxLotRepo: TaxLotRepo,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findTaxLotByBbl(bbl: string) {
    if (typeof bbl !== "string" || bbl.length !== 10)
      throw new BadRequestException(
        "Invalid data type or format for request parameter",
      );
    if (this.featureFlagConfig.useDrizzle) {
      const result = await this.taxLotRepo.findTaxLotByBbl(bbl);
      if (result === undefined) throw new NotFoundException();
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
    if (typeof bbl !== "string" || bbl.length !== 10)
      throw new BadRequestException(
        "Invalid data type or format for request parameter",
      );
    if (this.featureFlagConfig.useDrizzle) {
      const result = await this.taxLotRepo.findTaxLotByBblGeoJson(bbl);
      if (result === undefined) throw new NotFoundException();
      const geometry = JSON.parse(result.geometry);
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
    if (typeof bbl !== "string" || bbl.length !== 10)
      throw new BadRequestException(
        "Invalid data type or format for request parameter",
      );
    if (this.featureFlagConfig.useDrizzle) {
      if ((await this.taxLotRepo.findTaxLotByBblGeoJson(bbl)) === undefined)
        throw new NotFoundException();
      const zoningDistricts =
        await this.taxLotRepo.findZoningDistrictByTaxLotBbl(bbl);
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
    if (typeof bbl !== "string" || bbl.length !== 10)
      throw new BadRequestException(
        "Invalid data type or format for request parameter",
      );
    if (this.featureFlagConfig.useDrizzle) {
      if ((await this.taxLotRepo.findTaxLotByBbl(bbl)) === undefined)
        throw new NotFoundException();
      const zoningDistrictClasses =
        await this.taxLotRepo.findZoningDistrictClassByTaxLotBbl(bbl);
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
