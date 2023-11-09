import { Controller, Get, Param } from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";

@Controller("tax-lots")
export class TaxLotController {
  constructor(private readonly taxLotService: TaxLotService) {}

  @Get("/:bbl")
  async findDetailsByBbl(@Param() params: { bbl: string }) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  // @Get("/:bbl/geojson")
  // async findGeoJsonByBbl(@Param() bbl: string) {
  //   return this.taxlotService.findGeoJsonByBbl(bbl);
  // }
}
