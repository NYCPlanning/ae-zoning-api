import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class TaxLotService {
  constructor(
    @InjectRepository(TaxLot)
    private readonly taxLotRepository: TaxLotRepository,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findTaxLotByBbl(bbl: string): Promise<TaxLot | null> {
    if (this.featureFlagConfig.useDrizzle)
      throw new Error("Tax lot route not support in drizzle");
    return this.taxLotRepository.findOne(
      { bbl },
      {
        fields: ["bbl", "borough", "landUse", "block", "lot", "address"],
        populate: ["borough", "landUse"],
      },
    );
  }

  async findTaxLotByBblGeoJson(bbl: string): Promise<TaxLot | null> {
    if (this.featureFlagConfig.useDrizzle)
      throw new Error("Tax lot geojson route not support in drizzle");
    return this.taxLotRepository.findOne({ bbl });
  }
}
