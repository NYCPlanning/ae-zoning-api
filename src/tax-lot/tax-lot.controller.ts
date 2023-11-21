import { Controller, Get, Param, Redirect } from "@nestjs/common";
import { TaxLotService } from "./tax-lot.service";

@Controller("tax-lots")
export class TaxLotController {
  constructor(private readonly taxLotService: TaxLotService) {}

  @Get("/:bbl")
  async findDetailsByBbl(@Param() params: { bbl: string }) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  @Get("/:bbl/geojson")
  async findTaxLotByBblGeoJson(@Param() params: { bbl: string }) {
    return this.taxLotService.findTaxLotByBbl(params.bbl);
  }

  @Get("/:z/:x/:y")
  @Redirect(
    "https://de-sandbox.nyc3.digitaloceanspaces.com/ae-pilot-project/tilesets/tax_lot/",
    302,
  )
  findTaxLotTilesets(@Param() params: { z: number; x: number; y: string }) {
    return {
      url: `https://de-sandbox.nyc3.digitaloceanspaces.com/ae-pilot-project/tilesets/tax_lot/${params.z}/${params.x}/${params.y}`,
    };
  }
}
