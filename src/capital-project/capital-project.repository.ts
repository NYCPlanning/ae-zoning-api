import { Inject } from "@nestjs/common";
import { isNotNull, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import { FindCapitalProjectTilesPathParams } from "src/gen";
import { DB, DbType } from "src/global/providers/db.provider";
import { capitalProject } from "src/schema";
import { FindTilesRepo } from "./capital-project.repository.schema";

export class CapitalProjectRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  async findTiles(
    params: FindCapitalProjectTilesPathParams,
  ): Promise<FindTilesRepo> {
    const { z, x, y } = params;
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
        .as("tile");
      const data = await this.db
        .select({
          mvt: sql<string>`ST_AsMVT(tile, 'capital-project-fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
      return data[0].mvt;
    } catch {
      throw new DataRetrievalException();
    }
  }
}
