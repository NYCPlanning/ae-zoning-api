import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindCommunityDistrictsByBoroughIdRepo,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdRepo,
} from "./borough.repository.schema";
import { capitalProject, communityDistrict } from "src/schema";
import { eq, sql, and } from "drizzle-orm";

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
    } catch {
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

  async findCapitalProjectsByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
    limit,
    offset,
  }: {
    boroughId: string;
    communityDistrictId: string;
    limit: number;
    offset: number;
  }): Promise<FindCapitalProjectsByBoroughIdCommunityDistrictIdRepo> {
    try {
      return await this.db
        .select({
          id: capitalProject.id,
          description: capitalProject.description,
          managingCode: capitalProject.managingCode,
          managingAgency: capitalProject.managingAgency,
          maxDate: capitalProject.maxDate,
          minDate: capitalProject.minDate,
          category: capitalProject.category,
        })
        .from(capitalProject)
        .leftJoin(
          communityDistrict,
          sql`
          ST_Intersects(${communityDistrict.liFt}, ${capitalProject.liFtMPoly})
          OR ST_Intersects(${communityDistrict.liFt}, ${capitalProject.liFtMPnt})`,
        )
        .where(
          and(
            eq(communityDistrict.boroughId, boroughId),
            eq(communityDistrict.id, communityDistrictId),
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(capitalProject.managingCode, capitalProject.id);
    } catch {
      throw new DataRetrievalException();
    }
  }
}
