import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { DataRetrievalException } from "src/exception";
import {
  CheckByIdRepo,
  FindManyRepo,
  FindCommunityDistrictsByBoroughIdRepo,
  FindCapitalProjectsByBoroughIdCommunityDistrictIdRepo,
  FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepo,
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdRepo,
} from "./borough.repository.schema";
import { capitalProject, communityDistrict } from "src/schema";
import { eq, sql, and, isNotNull, asc } from "drizzle-orm";
import {
  CapitalProjectCategory,
  FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams,
  FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams,
} from "src/gen";

export class BoroughRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkBoroughById = this.db.query.borough
    .findFirst({
      columns: {
        id: true,
      },
      where: (borough, { eq, sql }) => eq(borough.id, sql.placeholder("id")),
    })
    .prepare("checkBoroughById");

  async checkBoroughById(id: string): Promise<CheckByIdRepo | undefined> {
    try {
      return await this.#checkBoroughById.execute({
        id,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findMany(): Promise<FindManyRepo> {
    try {
      return await this.db.query.borough.findMany();
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCommunityDistrictsByBoroughId(
    id: string,
  ): Promise<FindCommunityDistrictsByBoroughIdRepo> {
    try {
      return await this.db.query.communityDistrict.findMany({
        columns: {
          id: true,
          boroughId: true,
        },
        where: eq(communityDistrict.boroughId, id),
        orderBy: asc(communityDistrict.id),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCommunityDistrictGeoJsonByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
  }: FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdPathParams): Promise<
    FindCommunityDistrictGeoJsonByBoroughIdCommunityDistrictIdRepo | undefined
  > {
    try {
      return await this.db.query.communityDistrict.findFirst({
        columns: {
          id: true,
          boroughId: true,
        },
        extras: {
          geometry:
            sql<string>`ST_AsGeoJSON(ST_Transform(${communityDistrict.liFt}, 4326), 6)`.as(
              "geometry",
            ),
        },
        where: (communityDistrict, { and, eq }) =>
          and(
            eq(communityDistrict.boroughId, boroughId),
            eq(communityDistrict.id, communityDistrictId),
          ),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCapitalProjectsByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
    limit,
    offset,
  }: {
    boroughId: string;
    communityDistrictId: string;
    limit: number;
    offset: number;
  }): Promise<FindCapitalProjectsByBoroughIdCommunityDistrictIdRepo> {
    try {
      return await this.db
        .select({
          id: capitalProject.id,
          description: capitalProject.description,
          managingCode: capitalProject.managingCode,
          managingAgency: capitalProject.managingAgency,
          maxDate: capitalProject.maxDate,
          minDate: capitalProject.minDate,
          category: sql<CapitalProjectCategory>`${capitalProject.category}`,
        })
        .from(capitalProject)
        .leftJoin(
          communityDistrict,
          sql`
          ST_Intersects(${communityDistrict.liFt}, ${capitalProject.liFtMPoly})
          OR ST_Intersects(${communityDistrict.liFt}, ${capitalProject.liFtMPnt})`,
        )
        .where(
          and(
            eq(communityDistrict.boroughId, boroughId),
            eq(communityDistrict.id, communityDistrictId),
          ),
        )
        .limit(limit)
        .offset(offset)
        .orderBy(capitalProject.managingCode, capitalProject.id);
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findCapitalProjectTilesByBoroughIdCommunityDistrictId({
    boroughId,
    communityDistrictId,
    z,
    x,
    y,
  }: FindCapitalProjectTilesByBoroughIdCommunityDistrictIdPathParams): Promise<FindCapitalProjectTilesByBoroughIdCommunityDistrictIdRepo> {
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
          communityDistrict,
          sql`
            ST_Intersects(${communityDistrict.mercatorFill}, ${capitalProject.mercatorFillMPoly})
            OR ST_Intersects(${communityDistrict.mercatorFill}, ${capitalProject.mercatorFillMPnt})`,
        )
        .where(
          and(
            eq(communityDistrict.id, communityDistrictId),
            eq(communityDistrict.boroughId, boroughId),
          ),
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
      throw new DataRetrievalException();
    }
  }
}
