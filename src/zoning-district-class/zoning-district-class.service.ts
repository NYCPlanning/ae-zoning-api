import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @Inject(ZoningDistrictClassRepository)
    private readonly zoningDistrictClassRepository: ZoningDistrictClassRepository,
  ) {}

  async findMany() {
    const zoningDistrictClasses =
      await this.zoningDistrictClassRepository.findMany();
    return {
      zoningDistrictClasses,
    };
  }

  async findById(id: string) {
    const result = await this.zoningDistrictClassRepository.findById(
      id.toUpperCase(),
    );
    if (result === undefined)
      throw new ResourceNotFoundException("cannot find zoning district class");

    return result;
  }

  async findCategoryColors() {
    const zoningDistrictClassCategoryColors =
      await this.zoningDistrictClassRepository.findCategoryColors();

    return {
      zoningDistrictClassCategoryColors,
    };
  }
}
