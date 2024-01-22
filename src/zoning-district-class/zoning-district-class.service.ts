import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @Inject(ZoningDistrictClassRepository)
    private readonly zoningDistrictClassRepository: ZoningDistrictClassRepository,
  ) {}

  async findAllZoningDistrictClasses() {
    const zoningDistrictClasses =
      await this.zoningDistrictClassRepository.findAll();
    return {
      zoningDistrictClasses,
    };
  }

  async findZoningDistrictClassById(id: string) {
    const result = await this.zoningDistrictClassRepository.findById(id);
    if (result === undefined) throw new ResourceNotFoundException();

    return result;
  }

  async findZoningDistrictClassCategoryColors() {
    const zoningDistrictClassCategoryColors =
      await this.zoningDistrictClassRepository.findCategoryColors();

    return {
      zoningDistrictClassCategoryColors,
    };
  }
}
