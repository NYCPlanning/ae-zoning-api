import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindCommunityDistrictTilesPathParams } from "src/gen";
import { FindTilesRepo } from "./community-district.repository.schema";
import { communityDistrict } from "src/schema";
import { sql, isNotNull } from "drizzle-orm";

export class CommunityDistrictRepository {
    constructor(
        @Inject(DB)
        private readonly db: DbType,
      ) {}

    async findTiles(
    params: FindCommunityDistrictTilesPathParams,
    ): Promise<FindTilesRepo> {
    const { z, x, y } = params;
    try {
        const tile = this.db
            .select({
                communityDistrictId: sql<string>`${communityDistrict.id}`.as(`communityDistrictId`,),
                geom: sql<string>`
                CASE
                    WHEN ${communityDistrict.mercatorFill} && ST_TileEnvelope(${x},${x},${y})
                    THEN ST_AsMVTGeom(
                        ${communityDistrict.mercatorFill},
                        ST_TileEnvelope(${z},${x},${y}),
                        4095,
                        64,
                        true
                    )
                END` .as("geom"),
            })
            .from(communityDistrict)
            .as("tile");
        
        const data = await this.db
            .select({
                mvt: sql`ST_AsMVT(tile, 'community-district-fill', 4096, 'geom')`,
            })
            .from(tile)
            .where(isNotNull(tile.geom));
        return data[0].mvt;
    } catch {
        throw new DataRetrievalException();
    }
    }
}