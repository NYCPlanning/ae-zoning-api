import { generateMock } from "@anatine/zod-mock";
import { Geometry } from "geojson";
import {
  findByBblRepoSchema,
  findByBblSpatialRepoSchema,
  findZoningDistrictsByBblRepoSchema,
  checkByBblRepoSchema,
  findZoningDistrictClassesByBblRepoSchema,
  findManyRepoSchema,
  FindGeomFromGeoJSONRepo,
  FindManyBySpatialFilterRepo,
  findManyBySpatialFilterRepoSchema,
  findGeomFromGeoJSONRepoSchema,
  FindGeomBufferRepo,
  findGeomBufferRepoSchema,
  checkGeomIsValidRepoSchema,
  CheckGeomIsValidRepo,
} from "src/tax-lot/tax-lot.repository.schema";
import { Geom } from "src/types";

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

  async findGeomFromGeoJSON(
    shape: Geometry,
    targetSrid = 4326,
  ): Promise<FindGeomFromGeoJSONRepo> {
    return generateMock(findGeomFromGeoJSONRepoSchema, {
      stringMap: {
        geom: () => `feature: ${JSON.stringify(shape)} (${targetSrid})`,
      },
    });
  }

  async findGeomBuffer(
    geom: Geom,
    buffer: number,
  ): Promise<FindGeomBufferRepo> {
    return generateMock(findGeomBufferRepoSchema, {
      stringMap: {
        buffer: () => geom.replace("feature", `buffer: ${buffer}`),
      },
    });
  }

  async checkGeomIsValid(geom: Geom): Promise<CheckGeomIsValidRepo>{
    // Seed to make geom valid
    return generateMock(checkGeomIsValidRepoSchema, { seed : 1 })
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
    console.debug("intersectGeom", intersectGeom);
    const taxLotsMock = {
      feature: generateMock(findManyBySpatialFilterRepoSchema.length(10), {
        seed: 1,
      }),
      buffer: generateMock(findManyBySpatialFilterRepoSchema.length(10), {
        seed: 2,
      }),
    };
    const taxLots = intersectGeom.match(/feature/)
      ? taxLotsMock.feature
      : taxLotsMock.buffer;
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
