import { Inject, Injectable } from "@nestjs/common";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import { MultiPolygon } from "geojson";

@Injectable()
export class TaxLotService {
  constructor(
    @Inject(TaxLotRepository)
    private readonly taxLotRepository: TaxLotRepository,
  ) {}

  async findByBbl(bbl: string) {
    const result = await this.taxLotRepository.findByBbl(bbl);
    if (result === undefined) throw new ResourceNotFoundException();
    return result;
  }

  async findGeoJsonByBbl(bbl: string) {
    const result = await this.taxLotRepository.findByBblSpatial(bbl);
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

  async findZoningDistrictsByBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepository.checkByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();
    const zoningDistricts =
      await this.taxLotRepository.findZoningDistrictsByBbl(bbl);
    return {
      zoningDistricts,
    };
  }

  async findZoningDistrictClassesByBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepository.checkByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();

    const zoningDistrictClasses =
      await this.taxLotRepository.findZoningDistrictClassesByBbl(bbl);
    return {
      zoningDistrictClasses,
    };
  }

  async findTilesets(params: { z: number; x: number; y: number }) {
    const url = await this.taxLotRepository.findTilesets(params);
    return {
      url,
    };
  }
}
