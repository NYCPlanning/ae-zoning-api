import { Inject, Injectable } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { FindCommunityDistrictTilesPathParams } from "src/gen";
import {
  FindTilesRepo,
  CheckByBoroughIdCommunityDistrictIdRepo,
  CheckByBoroughIdCommunityDistrictIdsRepo,
} from "./community-district.repository.schema";
import { borough, communityDistrict } from "src/schema";
import { sql, isNotNull, eq, and, inArray } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CommunityDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkByBoroughIdCommunityDistrictId = this.db.query.communityDistrict
    .findFirst({
      columns: {
        boroughId: true,
        id: true,
      },
      where: (communityDistrict, { eq, sql }) =>
        and(
          eq(communityDistrict.boroughId, sql.placeholder("boroughId")),
          eq(communityDistrict.id, sql.placeholder("id")),
        ),
    })
    .prepare("checkByBoroughIdCommunityDistrictId");

  async checkByBoroughIdCommunityDistrictId(
    boroughId: string,
    id: string,
  ): Promise<CheckByBoroughIdCommunityDistrictIdRepo> {
    const key = JSON.stringify({
      boroughId,
      id,
      domain: "communityDistrict",
      function: "checkByBoroughIdCommunityDistrictId",
    });
    const cachedValue = await this.cacheManager.get<boolean>(key);
    if (cachedValue !== undefined) return cachedValue;
    try {
      const result = await this.#checkByBoroughIdCommunityDistrictId.execute({
        boroughId,
        id,
      });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot find community district given borough id and community district id",
      );
    }
  }

  // the ids must be deduplicated before passing them to this function
  // the count & length comparisons assume that every id is unique
  async checkByBoroughIdCommunityDistrictIds(
    ids: Array<string>,
  ): Promise<CheckByBoroughIdCommunityDistrictIdsRepo> {
    const orderedIds = [...ids].sort(); // sort a copy to avoid side effects on the original

    const key = JSON.stringify({
      orderedIds,
      domain: "communityDistrict",
      function: "checkByBoroughIdCommunityDistrictIds",
    });

    const cachedValue = await this.cacheManager.get<boolean>(key);
    if (cachedValue !== undefined) return cachedValue;

    try {
      const cds = await this.db
        .select({
          count: sql<number>`count(${communityDistrict.boroughId}||${communityDistrict.id})::int`,
        })
        .from(communityDistrict)
        .where(
          inArray(
            sql<string>`${communityDistrict.boroughId}||${communityDistrict.id}`,
            ids,
          ),
        );
      const value = cds[0].count == ids.length;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot check for community districts based on multiple ids",
      );
    }
  }

  async findTiles(
    params: FindCommunityDistrictTilesPathParams,
  ): Promise<FindTilesRepo> {
    const { z, x, y } = params;

    try {
      const tileFill = this.db
        .select({
          boroughIdCommunityDistrictId:
            sql`${communityDistrict.boroughId}||${communityDistrict.id}`.as(
              "boroughIdCommunityDistrictId",
            ),
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

      const dataFill = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'community-district-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const tileLabel = this.db
        .select({
          boroughIdCommunityDistrictId:
            sql`${communityDistrict.boroughId}||${communityDistrict.id}`.as(
              "boroughIdCommunityDistrictId",
            ),
          boroughAbbr: borough.abbr,
          geomLabel: sql`ST_AsMVTGeom(
    		  ${communityDistrict.mercatorLabel},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomLabel"),
        })
        .from(communityDistrict)
        .leftJoin(borough, eq(communityDistrict.boroughId, borough.id))
        .where(
          sql`${communityDistrict.mercatorLabel} && ST_TileEnvelope(${z},${x},${y})`,
        )
        .as("tile");

      const dataLabel = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'community-district-label', 4096, 'geomLabel')`,
        })
        .from(tileLabel)
        .where(isNotNull(tileLabel.geomLabel));

      const [fill, label] = await Promise.all([dataFill, dataLabel]);

      return Buffer.concat([fill[0].mvt, label[0].mvt]);
    } catch {
      throw new DataRetrievalException("cannot find community district tiles");
    }
  }
}
