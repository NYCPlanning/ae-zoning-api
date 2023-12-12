import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { DB, DbType } from "src/global/providers/db.provider";
import { TaxLotRepository } from "./tax-lot.repository";
import { FeatureFlagConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import {
  taxLot,
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import { eq, sql } from "drizzle-orm";
import { DataRetrievalException, ResourceNotFoundException } from "src/error";
import {
  SelectTaxLot,
  SelectTaxLotNested,
  SelectTaxLotSpatial,
} from "src/schema/tax-lot";
import { MultiPolygon } from "geojson";

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

  #checkTaxLotByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        bbl: true,
      },
      where: (taxLot, { eq, sql }) => eq(taxLot.bbl, sql.placeholder("bbl")),
    })
    .prepare("checkTaxLotByBbl");

  async findAllTaxLots({
    afterBbl,
    limit = 100,
  }: {
    afterBbl?: string;
    limit?: number;
  }) {
    const taxLots = afterBbl
      ? await this.db.query.taxLot.findMany({
          columns: {
            boroughId: false,
            landUseId: false,
            wgs84: false,
            liFt: false,
          },
          with: {
            borough: true,
            landUse: true,
          },
          where: (taxLot, { gt }) => gt(taxLot.bbl, afterBbl),
          limit: Math.min(100, limit),
          orderBy: taxLot.bbl,
        })
      : await this.db.query.taxLot.findMany({
          columns: {
            boroughId: false,
            landUseId: false,
            wgs84: false,
            liFt: false,
          },
          with: {
            borough: true,
            landUse: true,
          },
          limit: Math.min(100, limit),
          orderBy: taxLot.bbl,
        });
    const count = taxLots.length;
    const lastBbl = taxLots[count - 1].bbl;
    return {
      taxLots,
      page: {
        lastBbl,
        count,
        limit,
      },
    };
  }

  async findTaxLotByBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      let result: SelectTaxLotNested | undefined;
      try {
        result = await this.db.query.taxLot.findFirst({
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
      } catch {
        throw DataRetrievalException;
      }

      if (result === undefined) throw ResourceNotFoundException;
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
      let result: SelectTaxLotSpatial | undefined;
      try {
        result = await this.db.query.taxLot.findFirst({
          columns: {
            bbl: true,
            block: true,
            lot: true,
            address: true,
          },
          extras: {
            geometry: sql<string>`ST_AsGeoJSON(${taxLot.wgs84}, 6)`.as(
              "geometry",
            ),
          },
          where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
          with: {
            borough: true,
            landUse: true,
          },
        });
      } catch {
        throw DataRetrievalException;
      }
      if (result === undefined) throw ResourceNotFoundException;
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
      let taxLotCheck: Pick<SelectTaxLot, "bbl"> | undefined;
      try {
        taxLotCheck = await this.#checkTaxLotByBbl.execute({ bbl });
      } catch {
        throw DataRetrievalException;
      }
      if (taxLotCheck === undefined) throw ResourceNotFoundException;
      try {
        const zoningDistricts = await this.db
          .select({
            id: zoningDistrict.id,
            label: zoningDistrict.label,
          })
          .from(zoningDistrict)
          .leftJoin(
            taxLot,
            sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
          )
          .where(eq(taxLot.bbl, bbl));

        return {
          zoningDistricts,
        };
      } catch {
        throw DataRetrievalException;
      }
    } else {
      throw new Error(
        "Zoning district by tax lot bbl route not implemented in Mikro orm",
      );
    }
  }

  async findZoningDistrictClassByTaxLotBbl(bbl: string) {
    if (this.featureFlagConfig.useDrizzle) {
      let taxLotCheck: Pick<SelectTaxLot, "bbl"> | undefined;
      try {
        taxLotCheck = await this.#checkTaxLotByBbl.execute({ bbl });
      } catch {
        throw DataRetrievalException;
      }
      if (taxLotCheck === undefined) throw ResourceNotFoundException;
      try {
        const zoningDistrictClasses = await this.db
          .select({
            id: zoningDistrictClass.id,
            category: zoningDistrictClass.category,
            description: zoningDistrictClass.description,
            url: zoningDistrictClass.url,
            color: zoningDistrictClass.color,
          })
          .from(zoningDistrictClass)
          .leftJoin(
            zoningDistrictZoningDistrictClass,
            eq(
              zoningDistrictZoningDistrictClass.zoningDistrictClassId,
              zoningDistrictClass.id,
            ),
          )
          .leftJoin(
            zoningDistrict,
            eq(
              zoningDistrictZoningDistrictClass.zoningDistrictId,
              zoningDistrict.id,
            ),
          )
          .leftJoin(
            taxLot,
            sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
          )
          .where(eq(taxLot.bbl, bbl));

        return {
          zoningDistrictClasses,
        };
      } catch {
        throw DataRetrievalException;
      }
    } else {
      throw new Error(
        "Zoning district class by tax lot bbl route not implemented in Mikro orm",
      );
    }
  }
}
