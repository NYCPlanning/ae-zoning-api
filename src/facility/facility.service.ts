import { Injectable } from "@nestjs/common";
import { FacilityRepository } from "./facility.repository";
import { FindFacilityByIdPathParams } from "src/gen";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { Geom } from "src/types";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { Geometry, Position } from "geojson";
import { SIX_DECIMAL_RESOLUTION_FT } from "src/constants";

@Injectable()
export class FacilityService {
  constructor(
    private readonly facilityRepository: FacilityRepository,
    private readonly spatialRepository: SpatialRepository,
  ) {}

  async findMany({
    boroughIds = null,
    facilityJurisdictions = null,
    facilityOperatorTypes = null,
    facilityOversightAgency = null,
    facilityCategoryIds = null,
    facilityGroupIds = null,
    facilitySubgroupIds = null,
    communityDistrictIds = null,
    cityCouncilDistrictIds = null,
    bbl = null,
    bin = null,
    geometry = null,
    lons = null,
    lats = null,
    buffer = null,
    limit = 20,
    offset = 0,
  }: {
    boroughIds?: Array<string> | null;
    facilityJurisdictions?: Array<
      "City" | "County" | "State" | "Federal" | "Not specified"
    > | null;
    facilityOperatorTypes?: Array<
      "Public" | "Non-public" | "Not specified"
    > | null;
    facilityOversightAgency?: string | null;
    facilityCategoryIds?: Array<number> | null;
    facilityGroupIds?: Array<number> | null;
    facilitySubgroupIds?: Array<number> | null;
    communityDistrictIds?: Array<string> | null;
    cityCouncilDistrictIds?: Array<string> | null;
    bbl?: string | null;
    bin?: string | null;
    geometry?: "Point" | null;
    lons?: Array<number> | null;
    lats?: Array<number> | null;
    buffer?: number | null;
    limit?: number;
    offset?: number;
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
    const bufferFloor = buffer === null ? SIX_DECIMAL_RESOLUTION_FT : buffer;

    const facilitiesPromise = this.facilityRepository.findMany({
      boroughIds,
      facilityJurisdictions,
      facilityOperatorTypes,
      facilityOversightAgency,
      facilityCategoryIds,
      facilityGroupIds,
      facilitySubgroupIds,
      communityDistrictIds,
      cityCouncilDistrictIds,
      bbl,
      bin,
      geom,
      buffer: bufferFloor,
      limit,
      offset,
    });

    const facilitiesCountPromise = this.facilityRepository.findCount({
      boroughIds,
      facilityJurisdictions,
      facilityOperatorTypes,
      facilityOversightAgency,
      facilityCategoryIds,
      facilityGroupIds,
      facilitySubgroupIds,
      communityDistrictIds,
      cityCouncilDistrictIds,
      bbl,
      bin,
      geom,
      buffer: bufferFloor,
    });

    const [facilities, totalFacilities] = await Promise.all([
      facilitiesPromise,
      facilitiesCountPromise,
    ]);

    return {
      facilities,
      limit,
      offset,
      total: facilities.length,
      totalFacilities,
      order: `${geometry !== null ? "distance, " : ""}id`,
    };
  }

  async findById({ facilityId }: FindFacilityByIdPathParams) {
    const facilities = await this.facilityRepository.findById({ facilityId });

    if (facilities.length < 1) {
      throw new ResourceNotFoundException("Cannot find Facility");
    }

    return facilities[0];
  }

  async findCategories() {
    return await this.facilityRepository.findCategories();
  }

  async findAgencies() {
    return await this.facilityRepository.findAgencies();
  }
}
