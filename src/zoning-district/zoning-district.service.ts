import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictRepository } from "./zoning-district.repository";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(ZoningDistrictRepository)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
  ) {}

  async findZoningDistrictLabelTile(params: {
    z: number;
    x: number;
    y: number;
  }) {
    const labels =
      await this.zoningDistrictRepository.findZoningDistrictLabelTile(params);
    return labels;
  }

  async findZoningDistrictByUuid(uuid: string) {
    const zoningDistrict = await this.zoningDistrictRepository.findByUuid(uuid);
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
}
