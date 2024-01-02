import { Inject, Injectable } from "@nestjs/common";
import { BoroughRepository } from "./borough.repository";

@Injectable()
export class BoroughService {
  constructor(
    @Inject(BoroughRepository)
    private readonly boroughRepository: BoroughRepository,
  ) {}

  async findAll() {
    const boroughs = await this.boroughRepository.findAll();
    return {
      boroughs,
    };
  }
}
