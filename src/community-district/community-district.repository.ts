import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
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
    const tileFill = this.db
      .select({
        communityDistrictId: sql<string>`${communityDistrict.id}`.as(
          `communityDistrictId`,
        ),
        geom: sql<string>`
                      ST_AsMVTGeom(
                        ${communityDistrict.mercatorFill},
                        ST_TileEnvelope(${z},${x},${y}),
                        4096,
                        64,
                        true
                    )
                `.as("geom_fill"),
      })
      .from(communityDistrict)
      .where(
        sql`${communityDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
      )
      .as("tileFill");

    const dataFill = this.db
      .select({
        mvtFill: sql`ST_AsMVT(tileFill, 'community-district-fill', 4096, 'geom_fill')`,
      })
      .from(tileFill)
      .where(isNotNull(tileFill.geom));

    const tileLabel = this.db
      .select({
        communityDistrictId: sql<string>`${communityDistrict.id}`.as(
          `communityDistrictId`,
        ),
        geom: sql<string>`
                    ST_AsMVTGeom(
                        ${communityDistrict.mercatorLabel},
                        ST_TileEnvelope(${z},${x},${y}),
                        4096,
                        64,
                        true
                    )
                `.as("geom_label"),
      })
      .from(communityDistrict)
      .where(
        sql`${communityDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
      )
      .as("tileLabel");

    const dataLabel = this.db
      .select({
        mvtLabel: sql`ST_AsMVT(tileLabel, 'community-district-fill', 4096, 'geom_label')`,
      })
      .from(tileLabel)
      .where(isNotNull(tileLabel.geom));
    const [fill, label] = await Promise.all([dataFill, dataLabel]);

    return fill[0].mvtFill;
    // return `${fill[0].mvtFill}${label[0].mvtLabel}`;
  }
}
