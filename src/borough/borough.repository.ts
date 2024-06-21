import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindCommunityDistrictsByBoroughIdRepo,
} from "./borough.repository.schema";
import { communityDistrict } from "src/schema";
import { eq } from "drizzle-orm";

export class BoroughRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkBoroughById = this.db.query.borough
    .findFirst({
      columns: {
        id: true,
      },
      where: (borough, { eq, sql }) => eq(borough.id, sql.placeholder("id")),
    })
    .prepare("checkBoroughById");

  async checkBoroughById(id: string): Promise<CheckByIdRepo | undefined> {
    try {
      return await this.#checkBoroughById.execute({
        id,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.borough.findMany();
    } catch (e) {
      console.debug("error in boroughs", e);
      throw new DataRetrievalException();
    }
  }

  async findCommunityDistrictsByBoroughId(
    id: string,
  ): Promise<FindCommunityDistrictsByBoroughIdRepo> {
    try {
      return await this.db.query.communityDistrict.findMany({
        columns: {
          id: true,
          boroughId: true,
        },
        where: eq(communityDistrict.boroughId, id),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }
}
