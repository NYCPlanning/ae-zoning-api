import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { DB, DbType } from "src/global/providers/db.provider";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class TaxLotService {
  constructor(
    @InjectRepository(TaxLot)
    private readonly taxLotRepository: TaxLotRepository,

    @Inject(DB)
    private readonly db: DbType,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,
  ) {}

  async findTaxLotByBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const results = await this.db.query.taxLot.findMany({
        columns: {
          boroughId: false,
          landUseId: false,
          wgs84: false,
          liFt: false,
        },
        where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
        with: {
          borough: true,
          landUse: true,
        },
      });
      return results.length > 0 ? results[0] : null;
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

  async findTaxLotByBblGeoJson(bbl: string): Promise<TaxLot | null> {
    if (this.featureFlagConfig.useDrizzle)
      throw new Error("Tax lot geojson route not support in drizzle");
    return this.taxLotRepository.findOne({ bbl });
  }
}
