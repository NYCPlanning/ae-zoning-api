import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Borough } from "./borough.entity";
import { BoroughRepository } from "./borough.repository";

@Injectable()
export class BoroughService {
  constructor(
    @InjectRepository(Borough)
    private readonly boroughRepository: BoroughRepository,
  ) {}

  async findAll(): Promise<Borough[]> {
    return this.boroughRepository.findAll();
  }
}
