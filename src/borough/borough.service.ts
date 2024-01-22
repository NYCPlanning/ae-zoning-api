import { Inject, Injectable } from "@nestjs/common";
import { BoroughRepository } from "./borough.repository";

@Injectable()
export class BoroughService {
  constructor(
    @Inject(BoroughRepository)
    private readonly boroughRepository: BoroughRepository,
  ) {}

  async findMany() {
    const boroughs = await this.boroughRepository.findMany();
    return {
      boroughs,
    };
  }
}
