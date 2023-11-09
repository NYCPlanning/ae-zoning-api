import { EntityRepository } from "@mikro-orm/postgresql";
import { TaxLot } from "./tax-lot.entity";

export class TaxLotRepository extends EntityRepository<TaxLot> {}
