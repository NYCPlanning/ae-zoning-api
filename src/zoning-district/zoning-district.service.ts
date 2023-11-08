import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictRepository } from "./zoning-district.repository";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @InjectRepository(ZoningDistrict)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
  ) {}

  async findById(id: string): Promise<ZoningDistrict | null> {
    return this.zoningDistrictRepository.findOne(id, {
      fields: ["id", "label"],
    });
  }
}
