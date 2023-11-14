import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { Feature, MultiPolygon } from "geojson";

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

  async findTaxLotByBblGeoJson(
    bbl: string,
  ): Promise<Feature<MultiPolygon, Omit<TaxLot, "wgs84" | "liFt">> | null> {
    const taxLotByBblGeoJson = await this.taxLotRepository.findOne(
      { bbl },
      {
        fields: [
          "bbl",
          "borough",
          "landUse",
          "block",
          "lot",
          "address",
          "wgs84",
        ],
        populate: ["borough", "landUse"],
      },
    );

    if (taxLotByBblGeoJson === null) {
      return null;
    }

    return {
      id: taxLotByBblGeoJson.bbl,
      type: "Feature",
      geometry: taxLotByBblGeoJson.wgs84,
      properties: {
        bbl: taxLotByBblGeoJson.bbl,
        borough: taxLotByBblGeoJson.borough,
        block: taxLotByBblGeoJson.block,
        lot: taxLotByBblGeoJson.lot,
        address: taxLotByBblGeoJson.address,
        landUse: taxLotByBblGeoJson.landUse,
      },
    };
  }
}
