import { Inject, Injectable } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import { FindTilesRepo } from "./housing-growth.repository.schema";
import {
  FindHousingGrowthByBoroughTilesPathParams,
  FindHousingGrowthByCommunityDistrictTilesPathParams,
  FindHousingGrowthByNeighborhoodTabulationAreaTilesPathParams,
} from "src/gen";
import {
  borough,
  communityDistrict,
  housingGrowthCd,
  housingGrowthNta,
  neighborhoodTabluationArea,
} from "src/schema";
import { eq, lte, sql, isNotNull, and, sum } from "drizzle-orm";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class HousingGrowthRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findBoroughsTiles(
    params: FindHousingGrowthByBoroughTilesPathParams,
  ): Promise<FindTilesRepo> {
    const key = JSON.stringify({
      ...params,
      domain: "housingGrowth",
      function: "findBoroughsTiles",
    });

    const value = await this.cacheManager.get<Buffer<ArrayBufferLike>>(key);
    if (value !== undefined) {
      return value;
    }

    const { z, x, y } = params;

    try {
      const tileFill = this.db
        .select({
          id: borough.id,
          unitsCurrent: sum(housingGrowthCd.unitsCurrent)
            .mapWith(Number)
            .as("unitsCurrent"),
          completedUnitsPrevious10Years: sum(
            housingGrowthCd.completedUnitsPrevious10Years,
          )
            .mapWith(Number)
            .as("completedUnitsPrevious10Years"),
          projectedCompletedUnitsNext10Years: sum(
            housingGrowthCd.projectedCompletedUnitsNext10Years,
          )
            .mapWith(Number)
            .as("projectedCompletedUnitsNext10Years"),
          geomFill: sql`ST_AsMVTGeom(
    		  ${borough.mercatorFill},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomFill"),
        })
        .from(borough)
        .where(sql`${borough.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`)
        .leftJoin(
          housingGrowthCd,
          eq(borough.id, sql`LEFT(${housingGrowthCd.id}, 1)`),
        )
        .groupBy(borough.id)
        .as("tile");

      const dataFill = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'housing-growth-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const tileLabel = this.db
        .select({
          id: borough.id,
          label: sql`${borough.title}`.as("label"),
          geomLabel: sql`ST_AsMVTGeom(
    		  ${borough.mercatorLabel},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomLabel"),
        })
        .from(borough)
        .where(sql`${borough.mercatorLabel} && ST_TileEnvelope(${z},${x},${y})`)
        .as("tile");

      const dataLabel = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'housing-growth-label', 4096, 'geomLabel')`,
        })
        .from(tileLabel)
        .where(isNotNull(tileLabel.geomLabel));

      const [fill, label] = await Promise.all([dataFill, dataLabel]);

      const result = Buffer.concat([fill[0].mvt, label[0].mvt]);
      this.cacheManager.set(key, result);
      return result;
    } catch {
      throw new DataRetrievalException("cannot find borough tiles");
    }
  }

  async findCommunityDistrictsTiles(
    params: FindHousingGrowthByCommunityDistrictTilesPathParams,
  ): Promise<FindTilesRepo> {
    const key = JSON.stringify({
      ...params,
      domain: "housingGrowth",
      function: "findCommmunityDistrictsTiles",
    });

    const value = await this.cacheManager.get<Buffer<ArrayBufferLike>>(key);
    if (value !== undefined) {
      return value;
    }

    const { z, x, y } = params;

    try {
      const tileFill = this.db
        .select({
          id: sql`${communityDistrict.boroughId}||${communityDistrict.id}`.as(
            "id",
          ),
          unitsCurrent: sql`${housingGrowthCd.unitsCurrent}`.as("unitsCurrent"),
          completedUnitsPrevious10Years:
            sql`${housingGrowthCd.completedUnitsPrevious10Years}`.as(
              "completedUnitsPrevious10Years",
            ),
          projectedCompletedUnitsNext10Years:
            sql`${housingGrowthCd.projectedCompletedUnitsNext10Years}`.as(
              "projectedCompletedUnitsNext10Years",
            ),
          geomFill: sql`ST_AsMVTGeom(
    		  ${communityDistrict.mercatorFill},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomFill"),
        })
        .from(communityDistrict)
        .where(
          and(
            lte(sql`${communityDistrict.id}::int`, 18),
            sql`${communityDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
          ),
        )
        .leftJoin(
          housingGrowthCd,
          eq(
            sql`${communityDistrict.boroughId}||${communityDistrict.id}`,
            housingGrowthCd.id,
          ),
        )
        .as("tile");

      const dataFill = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'housing-growth-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const tileLabel = this.db
        .select({
          boroughIdCommunityDistrictId:
            sql`${communityDistrict.boroughId}||${communityDistrict.id}`.as(
              "boroughIdCommunityDistrictId",
            ),
          label: sql`${borough.abbr}||' '||${communityDistrict.id}`.as("label"),
          unitsCurrent: sql`${housingGrowthCd.unitsCurrent}`.as("unitsCurrent"),
          completedUnitsPrevious10Years:
            sql`${housingGrowthCd.completedUnitsPrevious10Years}`.as(
              "completedUnitsPrevious10Years",
            ),
          projectedCompletedUnitsNext10Years:
            sql`${housingGrowthCd.projectedCompletedUnitsNext10Years}`.as(
              "projectedCompletedUnitsNext10Years",
            ),
          geomLabel: sql`ST_AsMVTGeom(
    		  ${communityDistrict.mercatorLabel},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomLabel"),
        })
        .from(communityDistrict)
        .leftJoin(borough, eq(communityDistrict.boroughId, borough.id))
        .where(
          and(
            lte(sql`${communityDistrict.id}::int`, 18),
            sql`${communityDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
          ),
        )
        .leftJoin(
          housingGrowthCd,
          eq(
            sql`${communityDistrict.boroughId}||${communityDistrict.id}`,
            housingGrowthCd.id,
          ),
        )
        .as("tile");

      const dataLabel = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'housing-growth-label', 4096, 'geomLabel')`,
        })
        .from(tileLabel)
        .where(isNotNull(tileLabel.geomLabel));

      const [fill, label] = await Promise.all([dataFill, dataLabel]);

      const result = Buffer.concat([fill[0].mvt, label[0].mvt]);
      this.cacheManager.set(key, result);
      return result;
    } catch {
      throw new DataRetrievalException("cannot find community district tiles");
    }
  }

  async findNeighborhoodTabulationAreasTiles(
    params: FindHousingGrowthByNeighborhoodTabulationAreaTilesPathParams,
  ): Promise<FindTilesRepo> {
    const key = JSON.stringify({
      ...params,
      domain: "housingGrowth",
      function: "findNeighborhoodTabulationAreasTiles",
    });

    const value = await this.cacheManager.get<Buffer<ArrayBufferLike>>(key);
    if (value !== undefined) {
      return value;
    }

    const { z, x, y } = params;

    try {
      const tileFill = this.db
        .select({
          id: sql`${neighborhoodTabluationArea.code}`.as("id"),
          label: sql`${neighborhoodTabluationArea.name}`.as("label"),
          unitsCurrent: sql`${housingGrowthNta.unitsCurrent}`.as(
            "unitsCurrent",
          ),
          completedUnitsPrevious10Years:
            sql`${housingGrowthNta.completedUnitsPrevious10Years}`.as(
              "completedUnitsPrevious10Years",
            ),
          projectedCompletedUnitsNext10Years:
            sql`${housingGrowthNta.projectedCompletedUnitsNext10Years}`.as(
              "projectedCompletedUnitsNext10Years",
            ),
          geomFill: sql`ST_AsMVTGeom(
    		  ${neighborhoodTabluationArea.mercatorFill},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomFill"),
        })
        .from(neighborhoodTabluationArea)
        .where(
          and(
            sql`${neighborhoodTabluationArea.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
            eq(neighborhoodTabluationArea.year, 2020),
          ),
        )
        .leftJoin(
          housingGrowthNta,
          eq(neighborhoodTabluationArea.code, housingGrowthNta.id),
        )
        .as("tile");

      const dataFill = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'housing-growth-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const tileLabel = this.db
        .select({
          label: sql`${neighborhoodTabluationArea.name}`.as("label"),
          geomLabel: sql`ST_AsMVTGeom(
    		  ST_Transform((ST_MaximumInscribedCircle(mercator_fill)).center, 3857),
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomLabel"),
        })
        .from(neighborhoodTabluationArea)
        .where(
          sql`ST_Transform((ST_MaximumInscribedCircle(mercator_fill)).center, 3857) && ST_TileEnvelope(${z},${x},${y})`,
        )
        .as("tile");

      const dataLabel = this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'housing-growth-label', 4096, 'geomLabel')`,
        })
        .from(tileLabel)
        .where(isNotNull(tileLabel.geomLabel));

      const [fill, label] = await Promise.all([dataFill, dataLabel]);

      const result = Buffer.concat([fill[0].mvt, label[0].mvt]);
      this.cacheManager.set(key, result);
      return result;
    } catch {
      throw new DataRetrievalException(
        "cannot find neighborhood tabulation area tiles",
      );
    }
  }
}
