import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { ZoningDistrict } from "../zoning-district/zoning-district.entity";
import { Feature, MultiPolygon } from "geojson";

@Injectable()
export class TaxLotService {
  constructor(
    @InjectRepository(TaxLot)
    private readonly taxLotRepository: TaxLotRepository,

    @Inject(FeatureFlagConfig.KEY)
    private featureFlagConfig: ConfigType<typeof FeatureFlagConfig>,

    private readonly orm: MikroORM,
    private readonly em: EntityManager,
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

  async findZoningDistrictByTaxLotIntersection(
    bbl: string,
  ): Promise<Array<Omit<ZoningDistrict, "wgs84" | "liFt">> | null> {
    const connection = this.em.getConnection();
    return await connection.execute<
      Array<Omit<ZoningDistrict, "wgs84" | "liFt">>
    >(
      `SELECT id, label FROM zoning_district LEFT JOIN tax_lot ON ST_Intersects(zoning_district.li_ft, tax_lot.li_ft) WHERE tax_lot.bbl = '${bbl}'`,
    );
  }
}
