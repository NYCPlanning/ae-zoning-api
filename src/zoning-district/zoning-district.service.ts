import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ZoningDistrict } from "./zoning-district.entity";
import { ZoningDistrictRepository } from "./zoning-district.repository";

import { ZoningDistrictClass } from "../zoning-district-class/zoning-district-class.entity";
import { ZoningDistrictClassRepository } from "../zoning-district-class/zoning-district-class.repository";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @InjectRepository(ZoningDistrict)
    private readonly zoningDistrictRepository: ZoningDistrictRepository,
    private readonly zoningDistrictClassRepository: ZoningDistrictClassRepository
    // private readonly orm: MikroORM,
    // private readonly em: EntityManager,
  ) {}

  async findById(id: string): Promise<ZoningDistrict | null> {
    return this.zoningDistrictRepository.findOne(id, {
      fields: ["id", "label"],
    });
  }

  async findClassesByZoningDistrictId(
    id: string,
  ): Promise<unknown | null> {

    // const spaghetti = this.zoningDistrictClassRepository.findOne(id);

    return null;
  }


}
