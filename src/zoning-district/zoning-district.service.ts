import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictRepository } from "./zoning-district.repository";
import {
  FindZoningDistrictFillsPathParams,
  FindZoningDistrictLabelsPathParams,
} from "src/gen";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(ZoningDistrictRepository)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
  ) {}

  async findFills(params: FindZoningDistrictFillsPathParams) {
    const fills = await this.zoningDistrictRepository.findFills(params);
    return fills[0].mvt;
  }

  async findLabels(params: FindZoningDistrictLabelsPathParams) {
    const labels = await this.zoningDistrictRepository.findLabels(params);
    return labels[0].mvt;
  }

  async findById(id: string) {
    const zoningDistrict = await this.zoningDistrictRepository.findById(id);
    if (zoningDistrict === undefined) throw new ResourceNotFoundException();

    return zoningDistrict;
  }

  async findZoningDistrictClassesById(id: string) {
    const zoningDistrictCheck =
      await this.zoningDistrictRepository.checkById(id);
    if (zoningDistrictCheck === undefined)
      throw new ResourceNotFoundException();
    const zoningDistrictClasses =
      await this.zoningDistrictRepository.findZoningDistrictClassesById(id);

    return {
      zoningDistrictClasses,
    };
  }
}
