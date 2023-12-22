import { Inject, Injectable } from "@nestjs/common";
import { ResourceNotFoundException } from "src/exception";
import { ZoningDistrictRepo } from "./zoning-district.repo";

@Injectable()
export class ZoningDistrictService {
  constructor(
    @Inject(ZoningDistrictRepo)
    private readonly zoningDistrictRepo: ZoningDistrictRepo,
  ) {}

  async findZoningDistrictByUuid(uuid: string) {
  
      const zoningDistrict = await this.zoningDistrictRepo.findByUuid(uuid);
      if (zoningDistrict === undefined) throw new ResourceNotFoundException();

      return zoningDistrict;
  }

  async findClassesByZoningDistrictUuid(id: string) {
     
      const zoningDistrictCheck =
        await this.zoningDistrictRepo.checkZoningDistrictById(id);
      if (zoningDistrictCheck === undefined)
        throw new ResourceNotFoundException();
      const zoningDistrictClasses =
        await this.zoningDistrictRepo.findClassesByUuid(id);

      return {
        zoningDistrictClasses,
      };
    
  }
}
