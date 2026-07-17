import { Injectable } from "@nestjs/common";
import { InvalidRequestParameterException } from "src/exception";
import { Geom } from "src/types";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { Geometry, Position } from "geojson";

@Injectable()
export class SpatialService {
  constructor(private readonly spatialRepository: SpatialRepository) {}
  async createGeometryFromParams({
    geometry = null,
    lats = null,
    lons = null,
    buffer = null,
  }: {
    geometry?: "Point" | null;
    lats?: Array<number> | null;
    lons?: Array<number> | null;
    buffer?: number | null;
  }) {
    let geom: Geom | null = null;
    if (
      (lons !== null || lats !== null || buffer !== null) &&
      geometry === null
    )
      throw new InvalidRequestParameterException(
        "must provide with geometry with lons, lats, and buffer parameters",
      );
    if (geometry !== null) {
      if (lons == null || lats == null) {
        throw new InvalidRequestParameterException(
          "must provide latitude and longitude with geometry",
        );
      }
      if (lons.length !== lats.length) {
        throw new InvalidRequestParameterException(
          "latitude and longitude must be same length",
        );
      }

      const coordinates: Position = [lons[0], lats[0]];
      const feature: Geometry = {
        type: geometry,
        coordinates,
      };
      geom = await this.spatialRepository.findGeomFromGeoJson(feature, 2263);
    }

    return geom;
  }
}
