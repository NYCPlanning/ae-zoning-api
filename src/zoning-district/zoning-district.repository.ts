import { EntityRepository } from "@mikro-orm/postgresql";
import { ZoningDistrict } from "./zoning-district.entity";

export class ZoningDistrictRepository extends EntityRepository<ZoningDistrict> {}
