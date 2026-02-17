import { Geometry } from "geojson";
import { Geom } from "src/types";
import {
  FindGeomFromGeoJsonRepo,
  FindGeomBufferRepo,
  CheckGeomIsValidRepo,
  FindMaximumInscribedCircleCenterRepo,
} from "src/spatial/spatial.repository.schema";

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

export class SpatialRepositoryMock {
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
    const checkGeom: GeomMock = JSON.parse(geom);
    if (checkGeom.shape.type === "Point") return true;
    if (checkGeom.shape.type === "LineString") {
      const uniqueCoordinates = new Set(
        checkGeom.shape.coordinates.map((position) => position.join()),
      );
      // LineStrings are invalid when they have fewer than two unique points
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
}
