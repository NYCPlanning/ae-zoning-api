import { Inject, Injectable } from "@nestjs/common";
import { BoroughRepo } from "./borough.repo";

@Injectable()
export class BoroughService {
  constructor(
    @Inject(BoroughRepo)
    private readonly boroughRepo: BoroughRepo,
  ) {}

  async findAll() {
    const boroughs = await this.boroughRepo.findAll();
    return {
      boroughs,
    };
  }
}
