import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { StorageConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { eq, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  taxLot,
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import {
  FindByBblRepo,
  FindByBblSpatialRepo,
  CheckTaxLotByBblRepo,
  FindZoningDistrictByTaxLotBblRepo,
} from "./tax-lot.repository.schema";

export class TaxLotRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  #checkTaxLotByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        bbl: true,
      },
      where: (taxLot, { eq, sql }) => eq(taxLot.bbl, sql.placeholder("bbl")),
    })
    .prepare("checkTaxLotByBbl");

  async checkTaxLotByBbl(
    bbl: string,
  ): Promise<CheckTaxLotByBblRepo | undefined> {
    try {
      return await this.#checkTaxLotByBbl.execute({ bbl });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findByBbl(bbl: string): Promise<FindByBblRepo | undefined> {
    try {
      return await this.db.query.taxLot.findFirst({
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
      throw new DataRetrievalException();
    }
  }

  async findByBblSpatial(
    bbl: string,
  ): Promise<FindByBblSpatialRepo | undefined> {
    try {
      return await this.db.query.taxLot.findFirst({
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
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictByBbl(
    bbl: string,
  ): Promise<FindZoningDistrictByTaxLotBblRepo> {
    try {
      return await this.db
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
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictClassByBbl(bbl: string) {
    try {
      return await this.db
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
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findTaxLotTilesets(params: { z: number; x: number; y: number }) {
    return `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`;
  }
}
