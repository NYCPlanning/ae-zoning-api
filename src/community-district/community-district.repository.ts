import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { StorageConfig } from "src/config";
import { ConfigType } from "@nestjs/config";
import { eq } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  communityDistrict,
} from "src/schema";
import {
  // CheckByIdRepo,
  // FindByIdRepo,
  FindCommunityDistrictsByBoroughIdRepo,
} from "./community-district.repository.schema";

export class CommunityDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(StorageConfig.KEY)
    private storageConfig: ConfigType<typeof StorageConfig>,
  ) {}

  async findCommunityDistrictsByBoroughId(
    id: string,
  ): Promise<FindCommunityDistrictsByBoroughIdRepo> {
    try {
      return await this.db
        .select({
          id: communityDistrict.id,
          boroughId: communityDistrict.boroughId,
        })
        .from(communityDistrict)
        .where(eq(communityDistrict.id, id));
    } catch {
      throw new DataRetrievalException();
    }
  }

/*   async findCommunityDistrictsByBoroughId(
    id: string,
  ){
    try {
      return await this.db
        .select({
          id: communityDistrict.id,
          boroughId: communityDistrict.boroughId,
        })
        .from(communityDistrict)
        .where(eq(communityDistrict.id, id));
    } catch {
      throw new DataRetrievalException();
    }
  } */
}
