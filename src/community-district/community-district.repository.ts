import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { FindCommunityDistrictTilesPathParams } from "src/gen";
import { FindTilesRepo } from "./community-district.repository.schema";
// import { communityDistrict } from "src/schema";
// import { sql, isNotNull } from "drizzle-orm";
import { sql } from "drizzle-orm";

export class CommunityDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findTiles(
    params: FindCommunityDistrictTilesPathParams,
  ): Promise<FindTilesRepo> {
    const { z, x, y } = params;
    const data = (await this.db.execute(
      sql`
        WITH 
          tileFill AS (
            SELECT
              id,
              ST_AsMVTGeom(
                mercator_fill,
                ST_TileEnvelope(${z},${x},${y}),
                4096, 64, true
              ) AS geom
            FROM community_district
            WHERE mercator_fill && ST_TileEnvelope(${z},${x},${y})
          )
          SELECT 
            ST_AsMVT(tileFill, 'community-district-fill', 4096, 'geom') AS mvt
          FROM tileFill
          WHERE geom IS NOT NULL
        `,
    )) as unknown as { rows: Array<{ mvt: string }> };

    // console.debug(data.rows[0].mvt)
    return data.rows[0].mvt;

    // const tileFill = this.db
    //   .select({
    //     id: communityDistrict.id,
    //     geomFill: sql`ST_AsMVTGeom(
    // 		  ${communityDistrict.mercatorFill},
    // 		  ST_TileEnvelope(${z}, ${x}, ${y}),
    // 		  4096, 64, true)`.as("geomFill"),
    //   })
    //   .from(communityDistrict)
    //   .where(
    //     sql`${communityDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
    //   )
    //   .as("tile");

    // const data = await this.db
    //   .select({
    //     mvt: sql`ST_AsMVT(tile, 'community_district_fill', 4096, 'geomFill')`
    //   })
    //   .from(tileFill)
    //   .where(isNotNull(tileFill.geomFill));

    // return data[0].mvt;

    // const tileLabel = this.db
    //   .select({
    //     id: communityDistrict.id,
    //     geom: sql`ST_AsMVTGeom
    // 		  ${communityDistrict.mercatorLabel},
    // 		  ST_TileEnvelope(${z}, ${x}, ${y}),
    // 		  4096, 64, true)`.as("geom"),
    //   })
    //   .from(communityDistrict)
    //   .where(
    //     sql`${communityDistrict.mercatorLabel} && ST_TileEnvelope(${z},${x},${y})`,
    //   )
    //   .as("tile");

    // const dataLabel = this.db
    //   .select({
    //     mvt: sql`ST_AsMVT(tile, 'community_district_label', 4096, 'geom')`,
    //   })
    //   .from(tileLabel)
    //   .where(isNotNull(tileLabel.geom));
    // const [fill, label] = await Promise.all([dataFill, dataLabel])
    // return `${label[0].mvt}${fill[0].mvt}`;
  }
}
