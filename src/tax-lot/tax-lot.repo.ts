import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";

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
}
