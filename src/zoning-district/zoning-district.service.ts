import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictRepository } from "./zoning-district.repository";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(ZoningDistrictRepository)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
  ) {}

  async findById(id: string) {
    const zoningDistrict = await this.zoningDistrictRepository.findById(id);
    if (zoningDistrict === undefined) throw new ResourceNotFoundException();

    return zoningDistrict;
  }

  async findZoningDistrictClassesById(id: string) {
    const zoningDistrictCheck =
      await this.zoningDistrictRepository.checkById(id);
    if (zoningDistrictCheck === false) throw new ResourceNotFoundException();
    const zoningDistrictClasses =
      await this.zoningDistrictRepository.findZoningDistrictClassesById(id);

    return {
      zoningDistrictClasses,
    };
  }

  async findZoningDistrictTilesets(params: {
    z: number;
    x: number;
    y: number;
  }) {
    const url =
      await this.zoningDistrictRepository.findZoningDistrictTilesets(params);
    return {
      url,
    };
  }
}
