import { EntityRepository } from "@mikro-orm/postgresql";
import { LandUse } from "./land-use.entity";

export class LandUseRepository extends EntityRepository<LandUse> {}
