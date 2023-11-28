import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { sql } from "drizzle-orm";
import { DB, DbType } from "src/global/providers/db.provider";
import { taxLot } from "src/schema";

@Injectable()
export class TaxLotRepo {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}
  async findTaxLotByBbl(bbl: string) {
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
      throw new InternalServerErrorException("Error retrieving data");
    }
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
}
