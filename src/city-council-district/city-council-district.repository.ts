import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindTilesRepo,
  FindGeoJsonByIdRepo,
  FindCapitalProjectTilesByCityCouncilDistrictIdRepo,
} from "./city-council-district.repository.schema";
import {
  FindCapitalProjectTilesByCityCouncilDistrictIdPathParams,
  FindCityCouncilDistrictGeoJsonByCityCouncilDistrictIdPathParams,
  FindCityCouncilDistrictTilesPathParams,
} from "src/gen";
import {
  capitalCommitment,
  capitalCommitmentFund,
  capitalProject,
  cityCouncilDistrict,
} from "src/schema";
import { eq, sql, isNotNull, and } from "drizzle-orm";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
export class CityCouncilDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  #checkById = this.db.query.cityCouncilDistrict
    .findFirst({
      columns: {
        id: true,
      },
      where: (cityCouncilDistrict, { eq, sql }) =>
        eq(cityCouncilDistrict.id, sql.placeholder("id")),
    })
    .prepare("checkById");

  async checkById(id: string): Promise<CheckByIdRepo> {
    const key = JSON.stringify({
      id,
      domain: "cityCouncilDistrict",
      function: "checkById",
    });
    const cachedValue: boolean | null = await this.cacheManager.get(key);

    if (cachedValue !== null) return cachedValue;
    try {
      const result = await this.#checkById.execute({
        id,
      });
      const value = result !== undefined;
      this.cacheManager.set(key, value);
      return value;
    } catch {
      throw new DataRetrievalException(
        "cannot find city council district by id",
      );
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
      throw new DataRetrievalException("cannot find city council districts");
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
      throw new DataRetrievalException(
        "cannot find city council district geojson",
      );
    }
  }

  async findCapitalProjectTilesByCityCouncilDistrictId({
    cityCouncilDistrictId,
    z,
    x,
    y,
  }: FindCapitalProjectTilesByCityCouncilDistrictIdPathParams): Promise<FindCapitalProjectTilesByCityCouncilDistrictIdRepo> {
    try {
      const tile = this.db
        .select({
          managingCodeCapitalProjectId:
            sql<string>`${capitalProject.managingCode} || ${capitalProject.id}`.as(
              `managingCodeCapitalProjectId`,
            ),
          managingAgency: sql`${capitalProject.managingAgency}`.as(
            `managingAgency`,
          ),
          commitmentsTotal:
            sql`SUM(${capitalCommitmentFund.value})::double precision`
              .mapWith(Number)
              .as("commitmentsTotal"),
          agencyBudgets: sql<
            Array<string>
          >`ARRAY_TO_JSON(ARRAY_AGG(DISTINCT ${capitalCommitment.budgetLineCode}))`.as(
            "agencyBudgets",
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
        .leftJoin(
          capitalCommitment,
          and(
            eq(capitalCommitment.capitalProjectId, capitalProject.id),
            eq(capitalCommitment.managingCode, capitalProject.managingCode),
          ),
        )
        .leftJoin(
          capitalCommitmentFund,
          eq(capitalCommitmentFund.capitalCommitmentId, capitalCommitment.id),
        )
        .where(
          and(
            eq(cityCouncilDistrict.id, cityCouncilDistrictId),
            eq(capitalCommitmentFund.category, "total"),
          ),
        )
        .groupBy(
          capitalProject.id,
          capitalProject.managingCode,
          capitalProject.managingAgency,
          capitalProject.mercatorFillMPnt,
          capitalProject.mercatorFillMPoly,
        )
        .as("tile");
      const data = await this.db
        .select({
          mvt: sql<Buffer>`ST_AsMVT(tile, 'capital-project-fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
      return data[0].mvt;
    } catch {
      throw new DataRetrievalException(
        "cannot find capital project tiles given city council district",
      );
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
      throw new DataRetrievalException(
        "cannot find city council district tiles",
      );
    }
  }
}
