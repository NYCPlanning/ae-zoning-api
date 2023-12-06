import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { eq, sql } from "drizzle-orm";
import { CatchDataRetrievalException } from "src/error";
import { DB, DbType } from "src/global/providers/db.provider";
import {
  taxLot,
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";

@Injectable()
export class TaxLotRepo {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  @CatchDataRetrievalException 
  async findTaxLotByBbl(bbl: string) {
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
  }

  async findTaxLotByBblGeoJson(bbl: string) {
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
      throw new InternalServerErrorException("Error retrieving data");
    }
  }

  async findZoningDistrictByTaxLotBbl(bbl: string) {
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
      throw new InternalServerErrorException("Error retrieving data");
    }
  }

  async findZoningDistrictClassByTaxLotBbl(bbl: string) {
    try {
      return this.db
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
      throw new InternalServerErrorException("Error retrieving data");
    }
  }
}
