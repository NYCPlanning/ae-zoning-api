import { Controller, Get, Param } from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";

@Controller("tax-lots")
export class TaxLotController {
  constructor(private readonly taxlotService: TaxLotService) {}

  // @Get("/:bbl")
  // async findDetailsByBbl(@Param() bbl: string) {
  //   return this.taxlotService.findDetailsByBbl(bbl);
  // }

  // @Get("/:bbl/geojson")
  // async findGeoJsonByBbl(@Param() bbl: string) {
  //   return this.taxlotService.findGeoJsonByBbl(bbl);
  // }
}
