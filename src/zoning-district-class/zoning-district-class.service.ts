import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ZoningDistrictClass } from "./zoning-district-class.entity";
import { ZoningDistrictClassRepository } from "./zoning-district-class.repository";

@Injectable()
export class ZoningDistrictClassService {
  constructor(
    @InjectRepository(ZoningDistrictClass)
    private readonly zoningDistrictClassRepository: ZoningDistrictClassRepository,
  ) {}

  async findAllZoningDistrictClasses(): Promise<Array<ZoningDistrictClass>> {
    return this.zoningDistrictClassRepository.findAll();
  }

  async findZoningDistrictClassById(
    id: string,
  ): Promise<ZoningDistrictClass | null> {
    return this.zoningDistrictClassRepository.findOne(id);
  }
}
