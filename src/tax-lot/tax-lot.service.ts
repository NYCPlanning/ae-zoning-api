import { Inject, Injectable } from "@nestjs/common";
import { TaxLotRepository } from "./tax-lot.repository";
import { ResourceNotFoundException } from "src/exception";
import { Geometry, MultiPolygon } from "geojson";
import { z } from "zod";
import { FindTaxLotsQueryParams } from "src/gen";
import { InvalidSpatialFilterRequestParametersException } from "src/exception/invalid-spatial-filter";
import { Geom } from "src/types";

export const spatialFilterSchema = z.object({
  geometry: z.enum(["Point", "LineString", "Polygon"]),
  lons: z.array(z.number()).min(1).max(5),
  lats: z.array(z.number()).min(1).max(5),
  buffer: z.number().optional(),
});

export type SpatialFilter = z.infer<typeof spatialFilterSchema>;

@Injectable()
export class TaxLotService {
  constructor(
    @Inject(TaxLotRepository)
    private readonly taxLotRepository: TaxLotRepository,
  ) {}

  /**
   *
   * Tax lots are paginated and can be filtered using spatial features
   * The repository calls depend on the spatial filter applied
   * There are two key factors. First, the feature that is used filter the tax lots.
   * There may be 1) no filter, a 2) spatial filter, or 3) a spatial filter with a buffer. Second,
   * the criteria used to order the results. When no spatial filter is applied, tax lots
   * are sorted alphabetically by bbl. With a spatial filter, they are sorted by distance.
   * For points and linestrings, distance is measured to the feature itself. For polygons,
   * distance is measured to the center of the maximum inscribed circle. This is because
   * multiple tax lots could be on the plain of the polygon and technically all have the same
   * distance. Specifying a point on the polygon creates a differentiating factor.
   */
  async findMany({
    limit = 20,
    offset = 0,
    geometry,
    lons,
    lats,
    buffer,
  }: FindTaxLotsQueryParams) {
    // When there are no spatial parameters provided, it is a valid search for a non-filtered list of tax lots
    if (
      geometry === undefined &&
      lons === undefined &&
      lats === undefined &&
      buffer === undefined
    ) {
      const taxLots = await this.taxLotRepository.findMany({
        limit,
        offset,
      });
      return {
        taxLots,
        limit,
        offset,
        order: "bbl",
        total: taxLots.length,
      };
    }

    // When all of the required spatial parameters are provided, it is a valid search for a filtered list
    if (geometry !== undefined && lons !== undefined && lats !== undefined) {
      if (lons.length !== lats.length)
        throw new InvalidSpatialFilterRequestParametersException(
          "latitude and longitude lengths differ",
        );

      // Define parameters in a common scope when they will be applied to all feature types
      let shape: Geometry;
      let geom: Geom = "";
      let orderGeom: Geom = "";

      if (geometry === "Point") {
        if (lons.length !== 1)
          throw new InvalidSpatialFilterRequestParametersException(
            "more than one coordinate provided for Point",
          );

        // Point-specific geojson
        shape = {
          type: geometry,
          coordinates: [lons[0], lats[0]],
        };

        geom = await this.taxLotRepository.findGeomFromGeoJson(shape, 2263);

        orderGeom = geom;
      }

      if (geometry === "LineString") {
        if (lons.length < 2)
          throw new InvalidSpatialFilterRequestParametersException(
            "fewer than two coordinates provided for LineString",
          );

        // LineString specific geojson
        shape = {
          type: geometry,
          coordinates: lons.map((lon, index) => [lon, lats[index]]),
        };

        geom = await this.taxLotRepository.findGeomFromGeoJson(shape, 2263);

        orderGeom = geom;

        // LineString geom validity check
        const valid = await this.taxLotRepository.checkGeomIsValid(geom);
        if (!valid)
          throw new InvalidSpatialFilterRequestParametersException(
            "geometry is invalid",
          );
      }

      if (geometry === "Polygon") {
        if (lons.length < 4)
          throw new InvalidSpatialFilterRequestParametersException(
            "fewer than four coordinates provided for Polygon",
          );

        // Polygon specific geojson
        shape = {
          type: geometry,
          coordinates: [lons.map((lon, index) => [lon, lats[index]])],
        };

        geom = await this.taxLotRepository.findGeomFromGeoJson(shape, 2263);

        // Polygon geom validity check
        const valid = await this.taxLotRepository.checkGeomIsValid(geom);
        if (!valid)
          throw new InvalidSpatialFilterRequestParametersException(
            "geometry is invalid",
          );

        // Find the center of the maximum inscribed circle for distance ordering
        const center =
          await this.taxLotRepository.findMaximumInscribedCircleCenter(geom);

        orderGeom = center;
      }

      let intersectGeom: string;
      // If a buffer was provided, then it will be used as the spatial filter
      if (buffer !== undefined) {
        const geomBuffer = await this.taxLotRepository.findGeomBuffer(
          geom,
          buffer,
        );
        intersectGeom = geomBuffer;
      } else {
        intersectGeom = geom;
      }

      const taxLots = await this.taxLotRepository.findManyBySpatialFilter({
        limit,
        offset,
        intersectGeom,
        orderGeom,
      });

      return {
        taxLots,
        limit,
        offset,
        order: "distance",
        total: taxLots.length,
      };
    }

    // If the above conditions were not met, this implies that an incomplete set of spatial parameters were supplied.
    throw new InvalidSpatialFilterRequestParametersException(
      "missing required parameters",
    );
  }

  async findByBbl(bbl: string) {
    const result = await this.taxLotRepository.findByBbl(bbl);
    if (result === undefined) throw new ResourceNotFoundException();
    return result;
  }

  async findGeoJsonByBbl(bbl: string) {
    const result = await this.taxLotRepository.findByBblSpatial(bbl);
    if (result === undefined) throw new ResourceNotFoundException();

    const geometry = JSON.parse(result.geometry) as MultiPolygon;

    return {
      type: "Feature",
      id: result.bbl,
      properties: {
        bbl: result.bbl,
        borough: result.borough,
        block: result.block,
        lot: result.lot,
        address: result.address,
        landUse: result.landUse,
      },
      geometry,
    };
  }

  async findZoningDistrictsByBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepository.checkByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();
    const zoningDistricts =
      await this.taxLotRepository.findZoningDistrictsByBbl(bbl);
    return {
      zoningDistricts,
    };
  }

  async findZoningDistrictClassesByBbl(bbl: string) {
    const taxLotCheck = await this.taxLotRepository.checkByBbl(bbl);
    if (taxLotCheck === undefined) throw new ResourceNotFoundException();

    const zoningDistrictClasses =
      await this.taxLotRepository.findZoningDistrictClassesByBbl(bbl);
    return {
      zoningDistrictClasses,
    };
  }

  async findTilesets(params: { z: number; x: number; y: number }) {
    const url = await this.taxLotRepository.findTilesets(params);
    return {
      url,
    };
  }
}
