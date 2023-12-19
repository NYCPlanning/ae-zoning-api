import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq, sql } from "drizzle-orm";
import { DataRetrievalException, ResourceNotFoundException } from "src/error";
import {
  SelectTaxLot,
  SelectTaxLotNested,
  SelectTaxLotSpatial,
} from "src/schema/tax-lot";
import {
  taxLot,
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";
import { MultiPolygon } from "geojson";

export class TaxLotRepo {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkTaxLotByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        bbl: true,
      },
      where: (taxLot, { eq, sql }) => eq(taxLot.bbl, sql.placeholder("bbl")),
    })
    .prepare("checkTaxLotByBbl");

  async taxLotByBbl(bbl: string) {
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
  }

  async taxLotByBblGeoJson(bbl: string) {
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
  }

  async zoningDistrictByTaxLotBbl(bbl: string) {
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
  }

  async zoningDistrictClassByTaxLotBbl(bbl: string) {
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
  }
}
