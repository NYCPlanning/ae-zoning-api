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
    return this.taxLotRepository.findOne(
      { bbl },
      {
        fields: ["bbl", "borough", "landUse", "block", "lot", "address"],
        populate: ["borough", "landUse"],
      },
    );
  }

  async findTaxLotByBblGeoJson(bbl: string): Promise<TaxLot | null> {
    return this.taxLotRepository.findOne({ bbl });
  }
}
