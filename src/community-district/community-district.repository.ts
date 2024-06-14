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
        id: communityDistrict.id,
        geomFill: sql`ST_AsMVTGeom(
    		  ${communityDistrict.mercatorFill},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomFill"),
      })
      .from(communityDistrict)
      .where(
        sql`${communityDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
      )
      .as("tile");

    const dataFill = await this.db
      .select({
        mvt: sql`ST_AsMVT(tile, 'community-district-fill', 4096, 'geomFill')`,
      })
      .from(tileFill)
      .where(isNotNull(tileFill.geomFill));

    const tileLabel = this.db
      .select({
        id: communityDistrict.id,
        geomLabel: sql`ST_AsMVTGeom(
    		  ${communityDistrict.mercatorLabel},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomLabel"),
      })
      .from(communityDistrict)
      .where(
        sql`${communityDistrict.mercatorLabel} && ST_TileEnvelope(${z},${x},${y})`,
      )
      .as("tile");

    const dataLabel = this.db
      .select({
        mvt: sql`ST_AsMVT(tile, 'community-district-label', 4096, 'geomLabel')`,
      })
      .from(tileLabel)
      .where(isNotNull(tileLabel.geomLabel));

    const [fill, label] = await Promise.all([dataFill, dataLabel]);

    return Buffer.concat([fill[0].mvt, label[0].mvt] as Uint8Array[]);
  }
}
