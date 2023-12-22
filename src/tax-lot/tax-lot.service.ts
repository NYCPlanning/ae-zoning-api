import { Inject, Injectable } from "@nestjs/common";
import { TaxLotRepo } from "./tax-lot.repo";
import { ResourceNotFoundException } from "src/exception";
import { MultiPolygon } from "geojson";

@Injectable()
export class TaxLotService {
  constructor(
    @Inject(TaxLotRepo)
    private readonly taxLotRepo: TaxLotRepo,
  ) {}

  async findTaxLotByBbl(bbl: string) {
    const result = await this.taxLotRepo.findByBbl(bbl);
    if (result === undefined) throw new ResourceNotFoundException();
    return result;
  }

  async findTaxLotByBblGeoJson(bbl: string) {
    const result = await this.taxLotRepo.findByBblSpatial(bbl);
    if (result === undefined) throw new ResourceNotFoundException();

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

  async findZoningDistrictByTaxLotBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepo.checkTaxLotByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();
    const zoningDistricts = await this.taxLotRepo.findZoningDistrictByBbl(bbl);
    return {
      zoningDistricts,
    };
  }

  async findZoningDistrictClassByTaxLotBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepo.checkTaxLotByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();

    const zoningDistrictClasses =
      await this.taxLotRepo.findZoningDistrictClassByBbl(bbl);
    return {
      zoningDistrictClasses,
    };
  }
}
