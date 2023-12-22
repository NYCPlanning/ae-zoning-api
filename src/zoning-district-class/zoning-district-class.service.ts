import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictClassRepo } from "./zoning-district-class.repo";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @Inject(ZoningDistrictClassRepo)
    private readonly zoningDistrictClassRepo: ZoningDistrictClassRepo,
  ) {}

  async findAllZoningDistrictClasses() {
    const zoningDistrictClasses = await this.zoningDistrictClassRepo.findAll();
    return {
      zoningDistrictClasses,
    };
  }

  async findZoningDistrictClassById(id: string) {
    const result = this.zoningDistrictClassRepo.findById(id);
    if (result === undefined) throw new ResourceNotFoundException();

    return result;
  }

  async findZoningDistrictClassCategoryColors() {
    const zoningDistrictClassCategoryColors =
      await this.zoningDistrictClassRepo.findCategoryColors();

    return {
      zoningDistrictClassCategoryColors,
    };
  }
}
