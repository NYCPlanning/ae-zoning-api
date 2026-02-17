import { generateMock } from "@anatine/zod-mock";
import { GeomMock } from "test/spatial/spatial.repository.mock";
import { taxLotEntitySchema } from "src/schema";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictsByBblRepoSchema,
  findZoningDistrictClassesByBblRepoSchema,
  FindManyBySpatialFilterRepo,
  findManyBySpatialFilterRepoSchema,
  CheckByBblRepo,
  FindManyRepo,
  FindByBblRepo,
  FindByBblSpatialRepo,
  FindZoningDistrictsByBblRepo,
  FindZoningDistrictClassesByBblRepo,
} from "src/tax-lot/tax-lot.repository.schema";
import { Geom } from "src/types";

export class TaxLotRepositoryMock {
  lots = Array.from(Array(10), (_, index) =>
    generateMock(taxLotEntitySchema, { seed: index + 1 }),
  );

  async checkByBbl(bbl: string): Promise<CheckByBblRepo> {
    return this.lots.some((row) => row.bbl === bbl);
  }

  async findMany({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<FindManyRepo> {
    return this.lots.slice(offset, limit + offset);
  }

  async findManyBySpatialFilter({
    limit,
    offset,
    intersectGeom,
    orderGeom,
  }: {
    limit: number;
    offset: number;
    intersectGeom: Geom;
    orderGeom: Geom;
  }): Promise<FindManyBySpatialFilterRepo> {
    /**
     * The mocks return more results when the intersection geometry is a buffer.
     * This emulates buffers covering a larger area
     */
    const taxLotsMock = {
      feature: generateMock(findManyBySpatialFilterRepoSchema.length(2)),
      buffer: generateMock(findManyBySpatialFilterRepoSchema.length(10)),
    };
    const intersectGeomMock: GeomMock = JSON.parse(intersectGeom);
    const taxLots =
      intersectGeomMock.pattern === "feature"
        ? taxLotsMock.feature
        : taxLotsMock.buffer;

    /*
     * The mocks return different sorting patterns based on whether it was ordered
     * on the feature itself or the center of the feature. This emulates polygons sorting
     * based on "centers" instead of the feature itself.
     */
    const orderGeomMock: GeomMock = JSON.parse(orderGeom);
    if (orderGeomMock.pattern === "feature") {
      taxLots.sort((a, b) => {
        if (a.bbl < b.bbl) {
          return 1;
        } else {
          return -1;
        }
      });
    } else {
      taxLots.sort((a, b) => {
        if (a.bbl > b.bbl) {
          return 1;
        } else {
          return -1;
        }
      });
    }
    return taxLots.slice(offset, limit + offset);
  }

  findByBblMocks = Array.from(Array(1), (_, seed) =>
    generateMock(findByBblRepoSchema, { seed: seed + 1 }),
  );

  async findByBbl(bbl: string): Promise<FindByBblRepo | undefined> {
    return this.findByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblSpatialMocks = Array.from(Array(10), (_, seed) =>
    generateMock(findByBblSpatialRepoSchema, { seed: seed + 1 }),
  );

  async findByBblSpatial(
    bbl: string,
  ): Promise<FindByBblSpatialRepo | undefined> {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }

  findZoningDistrictByTaxLotBblMocks = this.lots.map((lot) => {
    return {
      [lot.bbl]: generateMock(findZoningDistrictsByBblRepoSchema),
    };
  });

  async findZoningDistrictsByBbl(
    bbl: string,
  ): Promise<FindZoningDistrictsByBblRepo> {
    const results = this.findZoningDistrictByTaxLotBblMocks.find(
      (taxLotZoningDistrictsPair) => bbl in taxLotZoningDistrictsPair,
    );
    return results === undefined ? [] : results[bbl];
  }

  findZoningDistrictClassByTaxLotBblMocks = this.lots.map((lot) => {
    return {
      [lot.bbl]: generateMock(findZoningDistrictClassesByBblRepoSchema),
    };
  });

  async findZoningDistrictClassesByBbl(
    bbl: string,
  ): Promise<FindZoningDistrictClassesByBblRepo> {
    const results = this.findZoningDistrictClassByTaxLotBblMocks.find(
      (taxLotZoningDistrictClasses) => bbl in taxLotZoningDistrictClasses,
    );
    return results === undefined ? [] : results[bbl];
  }
}
