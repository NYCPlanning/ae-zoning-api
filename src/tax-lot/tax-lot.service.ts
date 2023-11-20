import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { DB, DbType } from "src/global/providers/db.provider";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { taxLot } from "src/schema";
import { sql } from "drizzle-orm";

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

  async findTaxLotByBblGeoJson(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      const result = await this.db.query.taxLot.findMany({
        columns: {
          bbl: true,
          block: true,
          lot: true,
          address: true,
        },
        extras: {
          geometry: sql<string>`ST_AsGeoJSON(${taxLot.wgs84})`.as("geometry"),
        },
        where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
        with: {
          borough: true,
          landUse: true,
        },
      });
      if (result.length === 0) return null;
      const taxLotResult = result[0];
      const geometry = JSON.parse(taxLotResult.geometry);
      return {
        type: "Feature",
        id: taxLotResult.bbl,
        properties: {
          bbl: taxLotResult.bbl,
          borough: taxLotResult.borough,
          block: taxLotResult.block,
          lot: taxLotResult.lot,
          address: taxLotResult.address,
          landUse: taxLotResult.landUse,
        },
        geometry,
      };
    } else {
      return this.taxLotRepository.findOne({ bbl });
    }
  }
}
