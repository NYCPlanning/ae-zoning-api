import { Inject, Injectable } from "@nestjs/common";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import { MultiPolygon } from "geojson";
import { GetTaxLotFillsPathParams, GetTaxLotLabelsPathParams } from "src/gen";

@Injectable()
export class TaxLotService {
  constructor(
    @Inject(TaxLotRepository)
    private readonly taxLotRepository: TaxLotRepository,
  ) {}

  async findFills(params: GetTaxLotFillsPathParams) {
    const fills = await this.taxLotRepository.findFills(params);
    return fills[0].mvt;
  }

  async findLabels(params: GetTaxLotLabelsPathParams) {
    const labels = await this.taxLotRepository.findLabels(params);
    return labels[0].mvt;
  }

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
}
