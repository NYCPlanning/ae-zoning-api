import { Inject, Injectable } from "@nestjs/common";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import { MultiPolygon } from "geojson";
import { StorageConfig } from "src/config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class TaxLotService {
  constructor(
    @Inject(TaxLotRepository)
    private readonly taxLotRepository: TaxLotRepository,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  async findTaxLotByBbl(bbl: string) {
    const result = await this.taxLotRepository.findByBbl(bbl);
    if (result === undefined) throw new ResourceNotFoundException();
    return result;
  }

  async findTaxLotByBblGeoJson(bbl: string) {
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

  async findZoningDistrictByTaxLotBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepository.checkTaxLotByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();
    const zoningDistricts =
      await this.taxLotRepository.findZoningDistrictByBbl(bbl);
    return {
      zoningDistricts,
    };
  }

  async findZoningDistrictClassByTaxLotBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepository.checkTaxLotByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();

    const zoningDistrictClasses =
      await this.taxLotRepository.findZoningDistrictClassByBbl(bbl);
    return {
      zoningDistrictClasses,
    };
  }
  async findTaxLotTilesets(params: { z: number; x: number; y: number }) {
    console.info('storage url: ', this.storageConfig.storageUrl)
    return {
      url: `${this.storageConfig.storageUrl}/tilesets/tax_lot/${params.z}/${params.x}/${params.y}.pbf`,
    };
  }
}
