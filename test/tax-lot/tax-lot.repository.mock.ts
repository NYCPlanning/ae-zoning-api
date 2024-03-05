import { generateMock } from "@anatine/zod-mock";
import { Geometry } from "geojson";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictsByBblRepoSchema,
  checkByBblRepoSchema,
  findZoningDistrictClassesByBblRepoSchema,
  findManyRepoSchema,
  FindGeomFromGeoJsonRepo,
  FindManyBySpatialFilterRepo,
  findManyBySpatialFilterRepoSchema,
  FindGeomBufferRepo,
  CheckGeomIsValidRepo,
  FindMaximumInscribedCircleCenterRepo,
} from "src/tax-lot/tax-lot.repository.schema";
import { Geom } from "src/types";

/**
 * The Real PostGIS geometry is not human readable
 * However, mocking it as a stringified object
 * lets subsequent mocks change their behavior based on
 * what methods were called previously.
 *
 * The data sometimes results in states that don't quite make sense.
 * For example, mocks with "center" as their pattern may have "Polygon"
 * as their shape type. Topologically, centers should be Points. However,
 * this incongruence is fine for testing purposes.
 */
export type GeomMock = {
  shape: Geometry;
  pattern: "feature" | "buffer" | "center";
  srid: number;
};
export class TaxLotRepositoryMock {
  numberOfMocks = 1;

  checkByBblMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(checkByBblRepoSchema, { seed: seed + 1 }),
  );

  async checkByBbl(bbl: string) {
    return this.checkByBblMocks.find((row) => row.bbl === bbl);
  }

  findManyMocks = generateMock(findManyRepoSchema.length(10));

  async findMany({ limit, offset }: { limit: number; offset: number }) {
    return this.findManyMocks.slice(offset, limit + offset);
  }

  async findGeomFromGeoJson(
    shape: Geometry,
    targetSrid = 4326,
  ): Promise<FindGeomFromGeoJsonRepo> {
    const geom: GeomMock = {
      shape,
      pattern: "feature",
      srid: targetSrid,
    };
    return JSON.stringify(geom);
  }

  async findGeomBuffer(
    geom: Geom,
    _buffer: number,
  ): Promise<FindGeomBufferRepo> {
    const bufferGeom: GeomMock = JSON.parse(geom);
    bufferGeom.pattern = "buffer";

    return JSON.stringify(bufferGeom);
  }

  async checkGeomIsValid(geom: Geom): Promise<CheckGeomIsValidRepo> {
    // LineStrings are invalid when they have fewer than two unique points
    const checkGeom: GeomMock = JSON.parse(geom);
    if (checkGeom.shape.type === "LineString") {
      const uniqueCoordinates = new Set(
        checkGeom.shape.coordinates.map((position) => position.join()),
      );
      return uniqueCoordinates.size > 1;
    }

    // Polygons are invalid when their last coordinate does not close the shape
    if (checkGeom.shape.type === "Polygon") {
      const flatCoordinates = checkGeom.shape.coordinates[0].map((position) =>
        position.join(),
      );
      return flatCoordinates[0] === flatCoordinates[flatCoordinates.length - 1];
    }
    throw new Error("check geom called with unexpected geometry");
  }

  async findMaximumInscribedCircleCenter(
    geom: Geom,
  ): Promise<FindMaximumInscribedCircleCenterRepo> {
    const geomMock: GeomMock = JSON.parse(geom);

    geomMock.pattern = "center";
    return JSON.stringify(geomMock);
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
    orderGeomMock.pattern === "feature"
      ? taxLots.sort((a, b) => {
          if (a.bbl < b.bbl) {
            return 1;
          } else {
            return -1;
          }
        })
      : taxLots.sort((a, b) => {
          if (a.bbl > b.bbl) {
            return 1;
          } else {
            return -1;
          }
        });
    return taxLots.slice(offset, limit + offset);
  }

  findByBblMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(findByBblRepoSchema, { seed: seed + 1 }),
  );

  async findByBbl(bbl: string) {
    return this.findByBblMocks.find((row) => row.bbl === bbl);
  }

  findByBblSpatialMocks = Array.from(Array(this.numberOfMocks), (_, seed) =>
    generateMock(findByBblSpatialRepoSchema, { seed: seed + 1 }),
  );

  async findByBblSpatial(bbl: string) {
    return this.findByBblSpatialMocks.find((row) => row.bbl === bbl);
  }

  findZoningDistrictByTaxLotBblMocks = this.checkByBblMocks.map(
    (checkTaxLot) => {
      return {
        [checkTaxLot.bbl]: generateMock(findZoningDistrictsByBblRepoSchema),
      };
    },
  );

  async findZoningDistrictsByBbl(bbl: string) {
    const results = this.findZoningDistrictByTaxLotBblMocks.find(
      (taxLotZoningDistrictsPair) => bbl in taxLotZoningDistrictsPair,
    );
    return results === undefined ? [] : results[bbl];
  }

  findZoningDistrictClassByTaxLotBblMocks = this.checkByBblMocks.map(
    (checkTaxLot) => {
      return {
        [checkTaxLot.bbl]: generateMock(
          findZoningDistrictClassesByBblRepoSchema,
        ),
      };
    },
  );

  async findZoningDistrictClassesByBbl(bbl: string) {
    const results = this.findZoningDistrictClassByTaxLotBblMocks.find(
      (taxLotZoningDistrictClasses) => bbl in taxLotZoningDistrictClasses,
    );
    return results === undefined ? [] : results[bbl];
  }
}
