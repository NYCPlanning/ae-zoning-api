import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindTilesRepo,
  FindCapitalProjectsByCityCouncilDistrictIdRepo,
  FindGeoJsonByIdRepo,
  FindCapitalProjectTilesByCityCouncilDistrictIdRepo,
} from "./city-council-district.repository.schema";
import {
  FindCapitalProjectTilesByCityCouncilDistrictIdPathParams,
  FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams,
  FindCityCouncilDistrictTilesPathParams,
} from "src/gen";
import { capitalProject, cityCouncilDistrict } from "src/schema";
import { eq, sql, isNotNull } from "drizzle-orm";
import { CACHE, RedisCacheClient } from "src/global/providers/config.provider";
import { performance } from "perf_hooks";
export class CityCouncilDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,

    @Inject(CACHE)
    private readonly cache: RedisCacheClient,
  ) {}

  #checkCityCouncilDistrictById = this.db.query.cityCouncilDistrict
    .findFirst({
      columns: {
        id: true,
      },
      where: (cityCouncilDistrict, { eq, sql }) =>
        eq(cityCouncilDistrict.id, sql.placeholder("id")),
    })
    .prepare("checkCityCouncilDistrictById");

  async checkCityCouncilDistrictById(
    id: string,
  ): Promise<CheckByIdRepo | undefined> {
    try {
      return await this.#checkCityCouncilDistrictById.execute({
        id,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.cityCouncilDistrict.findMany({
        columns: {
          id: true,
        },
        orderBy: sql`${cityCouncilDistrict.id}::integer ASC`,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findGeoJsonById({
    cityCouncilDistrictId,
  }: FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams): Promise<
    FindGeoJsonByIdRepo | undefined
  > {
    try {
      return await this.db.query.cityCouncilDistrict.findFirst({
        columns: {
          id: true,
        },
        extras: {
          geometry:
            sql<string>`ST_AsGeoJSON(ST_Transform(${cityCouncilDistrict.liFt}, 4326), 6)`.as(
              "geometry",
            ),
        },
        where: (cityCouncilDistrict, { eq }) =>
          eq(cityCouncilDistrict.id, cityCouncilDistrictId),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCapitalProjectTilesByCityCouncilDistrictId({
    cityCouncilDistrictId,
    z,
    x,
    y,
  }: FindCapitalProjectTilesByCityCouncilDistrictIdPathParams): Promise<FindCapitalProjectTilesByCityCouncilDistrictIdRepo> {
    try {
      const start = performance.now();
      const cacheKey = `captial-project-tiles:city-council-districts:${z}:${x}:${y}`;
      const cacheValue = await this.cache.get(cacheKey);
      if (cacheValue !== null) {
        const value = Buffer.from(cacheValue, "binary");
        console.info("cache read:", cacheKey, performance.now() - start);
        return value;
      }
      const tile = this.db
        .select({
          managingCodeCapitalProjectId:
            sql<string>`${capitalProject.managingCode} || ${capitalProject.id}`.as(
              `managingCodeCapitalProjectId`,
            ),
          managingAgency: sql`${capitalProject.managingAgency}`.as(
            `managingAgency`,
          ),
          geom: sql<string>`
            CASE
              WHEN ${capitalProject.mercatorFillMPoly} && ST_TileEnvelope(${z},${x},${y})
                THEN ST_AsMVTGeom(
                  ${capitalProject.mercatorFillMPoly},
                  ST_TileEnvelope(${z},${x},${y}),
                  4096,
                  64,
                  true
                )
              WHEN ${capitalProject.mercatorFillMPnt} && ST_TileEnvelope(${z},${x},${y})
                THEN ST_AsMVTGeom(
                  ${capitalProject.mercatorFillMPnt},
                  ST_TileEnvelope(${z},${x},${y}),
                  4096,
                  64,
                  true
                )
            END`.as("geom"),
        })
        .from(capitalProject)
        .leftJoin(
          cityCouncilDistrict,
          sql`
            ST_Intersects(${cityCouncilDistrict.mercatorFill}, ${capitalProject.mercatorFillMPoly})
            OR ST_Intersects(${cityCouncilDistrict.mercatorFill}, ${capitalProject.mercatorFillMPnt})`,
        )
        .where(eq(cityCouncilDistrict.id, cityCouncilDistrictId))
        .as("tile");
      const data = await this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'capital-project-fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
      console.info("database read", cacheKey, performance.now() - start);
      const { mvt } = data[0];
      this.cache.set(cacheKey, mvt.toString("binary"));
      return mvt;
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findTiles(
    params: FindCityCouncilDistrictTilesPathParams,
  ): Promise<FindTilesRepo> {
    const { z, x, y } = params;

    try {
      const tileFill = this.db
        .select({
          id: cityCouncilDistrict.id,
          geomFill: sql`ST_AsMVTGeom(
    		  ${cityCouncilDistrict.mercatorFill},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomFill"),
        })
        .from(cityCouncilDistrict)
        .where(
          sql`${cityCouncilDistrict.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`,
        )
        .as("tile");

      const dataFill = await this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'city-council-district-fill', 4096, 'geomFill')`,
        })
        .from(tileFill)
        .where(isNotNull(tileFill.geomFill));

      const tileLabel = this.db
        .select({
          id: cityCouncilDistrict.id,
          geomLabel: sql`ST_AsMVTGeom(
    		  ${cityCouncilDistrict.mercatorLabel},
    		  ST_TileEnvelope(${z}, ${x}, ${y}),
    		  4096, 64, true)`.as("geomLabel"),
        })
        .from(cityCouncilDistrict)
        .where(
          sql`${cityCouncilDistrict.mercatorLabel} && ST_TileEnvelope(${z},${x},${y})`,
        )
        .as("tile");

      const dataLabel = this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'city-council-district-label', 4096, 'geomLabel')`,
        })
        .from(tileLabel)
        .where(isNotNull(tileLabel.geomLabel));

      const [fill, label] = await Promise.all([dataFill, dataLabel]);

      return Buffer.concat([fill[0].mvt, label[0].mvt] as Uint8Array[]);
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCapitalProjectsById({
    limit,
    offset,
    cityCouncilDistrictId,
  }: {
    limit: number;
    offset: number;
    cityCouncilDistrictId: string;
  }): Promise<FindCapitalProjectsByCityCouncilDistrictIdRepo> {
    try {
      const start = performance.now();
      const cacheKey = `capital-projects:city-council-district:${cityCouncilDistrictId}:${limit}:${offset}`;
      const cacheValue = await this.cache.get(cacheKey);
      if (cacheValue !== null) {
        const value = JSON.parse(cacheValue);
        console.info("cache lookup", cacheKey, performance.now() - start);
        return value;
      }
      const value = await this.db
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
          cityCouncilDistrict,
          sql`
            ST_Intersects(${cityCouncilDistrict.liFt}, ${capitalProject.liFtMPoly})
            OR ST_Intersects(${cityCouncilDistrict.liFt}, ${capitalProject.liFtMPnt})`,
        )
        .where(eq(cityCouncilDistrict.id, cityCouncilDistrictId))
        .limit(limit)
        .offset(offset)
        .orderBy(capitalProject.managingCode, capitalProject.id);
      console.info("database read", cacheKey, performance.now() - start);
      this.cache.set(cacheKey, JSON.stringify(value));
      return value;
    } catch {
      throw new DataRetrievalException();
    }
  }
}
