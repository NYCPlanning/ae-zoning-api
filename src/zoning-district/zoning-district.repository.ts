import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq, isNotNull, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";

export class ZoningDistrictRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkZoningDistrictById = this.db.query.zoningDistrict
    .findFirst({
      columns: {
        id: true,
      },
      where: (zoningDistrict, { eq, sql }) =>
        eq(zoningDistrict.id, sql.placeholder("id")),
    })
    .prepare("checkZoningDistrictById");

  async checkZoningDistrictById(id: string) {
    try {
      return await this.#checkZoningDistrictById.execute({
        id,
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findFillTile(params: { z: number; x: number; y: number }) {
    try {
      const { z, x, y } = params;
      const tile = this.db
        .select({
          id: zoningDistrict.id,
          label: zoningDistrict.label,
          class: sql`${zoningDistrictClass.id}`.as("class"),
          category: zoningDistrictClass.category,
          color: sql`'['
          ||('x'||SUBSTRING(${zoningDistrictClass.color}, 2, 2))::bit(8)::int||','
          ||('x'||SUBSTRING(${zoningDistrictClass.color}, 4, 2))::bit(8)::int||','
          ||('x'||SUBSTRING(${zoningDistrictClass.color}, 6, 2))::bit(8)::int||','
          ||('x'||SUBSTRING(${zoningDistrictClass.color}, 8, 2))::bit(8)::int||
          ']'`.as("color"),
          geom: sql`ST_AsMVTGeom(
            ST_Transform(ST_CurveToLine(${zoningDistrict.wgs84}::geometry), 3857),
            ST_TileEnvelope(${z}, ${x}, ${y}),
            4096, 64, true)`.as("geom"),
        })
        .from(zoningDistrict)
        .leftJoin(
          zoningDistrictZoningDistrictClass,
          eq(
            zoningDistrict.id,
            zoningDistrictZoningDistrictClass.zoningDistrictId,
          ),
        )
        .leftJoin(
          zoningDistrictClass,
          eq(
            zoningDistrictClass.id,
            zoningDistrictZoningDistrictClass.zoningDistrictClassId,
          ),
        )
        .where(
          sql`${zoningDistrict.wgs84} && ST_Transform(ST_TileEnvelope(${z}, ${x}, ${y}), 4326)`,
        )
        .as("tile");

      return await this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'zoning_district_fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findLabelTile(params: { z: number; x: number; y: number }) {
    const { z, x, y } = params;
    try {
      const tile = this.db
        .selectDistinctOn([zoningDistrict.id], {
          id: zoningDistrict.id,
          label: zoningDistrict.label,
          geom: sql`ST_AsMVTGeom(
            ST_Transform((ST_MaximumInscribedCircle(${zoningDistrict.wgs84}::geometry)).center, 3857),
            ST_TileEnvelope(${z}, ${x},${y}),
            4096,64,true)`.as("geom"),
          category:
            sql`'["'||STRING_AGG(${zoningDistrictClass.category}::TEXT, '","')||'"]'`.as(
              "category",
            ),
          class:
            sql`'["'||STRING_AGG(${zoningDistrictZoningDistrictClass.zoningDistrictClassId}, '","')||'"]'`.as(
              "class",
            ),
        })
        .from(zoningDistrict)
        .leftJoin(
          zoningDistrictZoningDistrictClass,
          eq(
            zoningDistrict.id,
            zoningDistrictZoningDistrictClass.zoningDistrictId,
          ),
        )
        .leftJoin(
          zoningDistrictClass,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictClassId,
            zoningDistrictClass.id,
          ),
        )
        .where(
          sql`${zoningDistrict.wgs84} && ST_Transform(ST_TileEnvelope(${z}, ${x},${y}),4326)`,
        )
        .groupBy(zoningDistrict.id, zoningDistrict.label)
        .as("tile");
      return await this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'zoning_district_label', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findByUuid(uuid: string) {
    try {
      return await this.db.query.zoningDistrict.findFirst({
        columns: { wgs84: false, liFt: false },
        where: eq(zoningDistrict.id, uuid),
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findClassesByUuid(id: string) {
    try {
      return await this.db
        .select({
          id: zoningDistrictClass.id,
          category: zoningDistrictClass.category,
          description: zoningDistrictClass.description,
          url: zoningDistrictClass.url,
          color: zoningDistrictClass.color,
        })
        .from(zoningDistrictClass)
        .leftJoin(
          zoningDistrictZoningDistrictClass,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictClassId,
            zoningDistrictClass.id,
          ),
        )
        .leftJoin(
          zoningDistrict,
          eq(
            zoningDistrictZoningDistrictClass.zoningDistrictId,
            zoningDistrict.id,
          ),
        )
        .where(eq(zoningDistrict.id, id));
    } catch {
      throw new DataRetrievalException();
    }
  }
}
