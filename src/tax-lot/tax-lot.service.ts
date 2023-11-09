import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { TaxLot } from "./tax-lot.entity";
import { TaxLotRepository } from "./tax-lot.repository";

@Injectable()
export class TaxLotService {
  constructor(
    @InjectRepository(TaxLot)
    private readonly taxLotRepository: TaxLotRepository,
  ) {}

  async findTaxLotByBbl(bbl: string): Promise<TaxLot | null> {
    return this.taxLotRepository.findOne(bbl);
  }

  // async findGeoJsonByBbl(bbl: string): Promise<TaxLot | null> {
  //   return this.taxlotRepository.findOne(bbl);
  // }
}
