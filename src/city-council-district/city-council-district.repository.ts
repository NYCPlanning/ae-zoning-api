import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindTilesRepo,
  FindCapitalProjectsByCityCouncilDistrictIdRepo,
} from "./city-council-district.repository.schema";
import { FindCityCouncilDistrictTilesPathParams } from "src/gen";
import { capitalProject, cityCouncilDistrict } from "src/schema";
import { eq, sql, isNotNull } from "drizzle-orm";
export class CityCouncilDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
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
      });
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
          cityCouncilDistrict,
          sql`
            ST_Intersects(${cityCouncilDistrict.liFt}, ${capitalProject.liFtMPoly}) 
            OR ST_Intersects(${cityCouncilDistrict.liFt}, ${capitalProject.liFtMPnt})`,
        )
        .where(eq(cityCouncilDistrict.id, cityCouncilDistrictId))
        .limit(limit)
        .offset(offset)
        .orderBy(capitalProject.managingCode, capitalProject.id);
    } catch {
      throw new DataRetrievalException();
    }
  }
}
