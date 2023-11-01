import { EntityRepository } from "@mikro-orm/postgresql";
import { Borough } from "./borough.entity";

export class BoroughRepository extends EntityRepository<Borough> {}
