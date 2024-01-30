import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictRepository } from "./zoning-district.repository";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(ZoningDistrictRepository)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
  ) {}

  async findZoningDistrictByUuid(id: string) {
    const zoningDistrict = await this.zoningDistrictRepository.findByUuid(id);
    if (zoningDistrict === undefined) throw new ResourceNotFoundException();

    return zoningDistrict;
  }

  async findClassesByZoningDistrictUuid(id: string) {
    const zoningDistrictCheck =
      await this.zoningDistrictRepository.checkZoningDistrictById(id);
    if (zoningDistrictCheck === undefined)
      throw new ResourceNotFoundException();
    const zoningDistrictClasses =
      await this.zoningDistrictRepository.findClassesByUuid(id);

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
