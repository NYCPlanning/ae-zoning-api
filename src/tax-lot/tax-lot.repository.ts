import { Inject } from "@nestjs/common";
import { DB, DbType } from "src/global/providers/db.provider";
import { eq, isNotNull, sql } from "drizzle-orm";
import { DataRetrievalException } from "src/exception";
import {
  landUse,
  taxLot,
  zoningDistrict,
  zoningDistrictClass,
  zoningDistrictZoningDistrictClass,
} from "src/schema";

export class TaxLotRepository {
  constructor(
    @Inject(DB)
    private readonly db: DbType,
  ) {}

  #checkTaxLotByBbl = this.db.query.taxLot
    .findFirst({
      columns: {
        bbl: true,
      },
      where: (taxLot, { eq, sql }) => eq(taxLot.bbl, sql.placeholder("bbl")),
    })
    .prepare("checkTaxLotByBbl");

  async findFills(params: { z: string; x: string; y: string }) {
    const { z, x, y } = params;
    try {
      const tile = this.db
        .select({
          bbl: taxLot.bbl,
          color: sql`'['
        ||('x'||SUBSTRING(${landUse.color}, 2, 2))::bit(8)::int||','
        ||('x'||SUBSTRING(${landUse.color}, 4, 2))::bit(8)::int||','
        ||('x'||SUBSTRING(${landUse.color}, 6, 2))::bit(8)::int||','
        ||('x'||SUBSTRING(${landUse.color}, 8, 2))::bit(8)::int||
        ']'`.as("color"),
          geom: sql`ST_AsMVTGeom(
				  ${taxLot.mercatorFill},
				  ST_TileEnvelope(${z}, ${x}, ${y}),
				  4096, 64, true)`.as("geom"),
        })
        .from(taxLot)
        .leftJoin(landUse, eq(landUse.id, taxLot.landUseId))
        .where(sql`${taxLot.mercatorFill} && ST_TileEnvelope(${z},${x},${y})`)
        .as("tile");

      return this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'tax_lot_fill', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findLabels(params: { z: string; x: string; y: string }) {
    const { z, x, y } = params;
    try {
      const tile = this.db
        .select({
          bbl: taxLot.bbl,
          geom: sql`ST_AsMVTGeom(
            ${taxLot.mercatorLabel},
            ST_TileEnvelope(${z}, ${x}, ${y})
          )`.as("geom"),
        })
        .from(taxLot)
        .where(sql`${taxLot.mercatorFill} && ST_TileEnvelope(${z}, ${x}, ${y})`)
        .as("tile");

      return await this.db
        .select({
          mvt: sql`ST_AsMVT(tile, 'tax_lot_label', 4096, 'geom')`,
        })
        .from(tile)
        .where(isNotNull(tile.geom));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async checkTaxLotByBbl(bbl: string) {
    try {
      return await this.#checkTaxLotByBbl.execute({ bbl });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findByBbl(bbl: string) {
    try {
      return await this.db.query.taxLot.findFirst({
        columns: {
          boroughId: false,
          landUseId: false,
          wgs84: false,
          liFt: false,
        },
        where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
        with: {
          borough: true,
          landUse: true,
        },
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findByBblSpatial(bbl: string) {
    try {
      return await this.db.query.taxLot.findFirst({
        columns: {
          bbl: true,
          block: true,
          lot: true,
          address: true,
        },
        extras: {
          geometry: sql<string>`ST_AsGeoJSON(${taxLot.wgs84}, 6)`.as(
            "geometry",
          ),
        },
        where: (taxLot, { eq }) => eq(taxLot.bbl, bbl),
        with: {
          borough: true,
          landUse: true,
        },
      });
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictByBbl(bbl: string) {
    try {
      return await this.db
        .select({
          id: zoningDistrict.id,
          label: zoningDistrict.label,
        })
        .from(zoningDistrict)
        .leftJoin(
          taxLot,
          sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
        )
        .where(eq(taxLot.bbl, bbl));
    } catch {
      throw new DataRetrievalException();
    }
  }

  async findZoningDistrictClassByBbl(bbl: string) {
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
        .leftJoin(
          taxLot,
          sql`ST_Intersects(${taxLot.liFt}, ${zoningDistrict.liFt})`,
        )
        .where(eq(taxLot.bbl, bbl));
    } catch {
      throw new DataRetrievalException();
    }
  }
}
