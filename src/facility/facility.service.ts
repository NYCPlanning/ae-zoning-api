import { Injectable } from "@nestjs/common";
import { FacilityRepository } from "./facility.repository";
import {
  FindFacilityByIdPathParams,
  FindFacilityGeoJsonByIdPathParams,
  FindFacilityTilesPathParams,
} from "src/gen";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { MultiPoint } from "geojson";
import { SIX_DECIMAL_RESOLUTION_FT } from "src/constants";
import { FacilityEntity } from "src/schema";
import { FacilityGeometry } from "./facility.repository.schema";
import { produce } from "immer";
import { SpatialService } from "src/spatial/spatial.service";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { BoroughRepository } from "src/borough/borough.repository";
import { AgencyRepository } from "src/agency/agency.repository";

@Injectable()
export class FacilityService {
  constructor(
    private readonly facilityRepository: FacilityRepository,
    private readonly spatialService: SpatialService,
    private readonly spatialRepository: SpatialRepository,
    private readonly boroughRepository: BoroughRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly agencyRepository: AgencyRepository,
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
    const geom: string | null =
      lons !== null || lats !== null || buffer !== null || geometry !== null
        ? await this.spatialService.createGeometryFromParams({
            geometry,
            lats,
            lons,
            buffer,
          })
        : null;
    const bufferFloor = buffer === null ? SIX_DECIMAL_RESOLUTION_FT : buffer;

    const checklist: Array<Promise<boolean>> = [];
    if (geom !== null) {
      checklist.push(this.spatialRepository.checkGeomIsValid(geom));
    }

    const uniqueCityCouncilDistrictIds =
      cityCouncilDistrictIds === null
        ? null
        : [...new Set(cityCouncilDistrictIds)];
    if (uniqueCityCouncilDistrictIds !== null) {
      checklist.push(
        this.cityCouncilDistrictRepository.checkByIds(
          uniqueCityCouncilDistrictIds,
        ),
      );
    }

    const uniqueBoroughIds =
      boroughIds === null ? null : [...new Set(boroughIds)];
    if (uniqueBoroughIds !== null) {
      checklist.push(this.boroughRepository.checkByIds(uniqueBoroughIds));
    }

    const uniqueCommunityDistrictIds =
      communityDistrictIds === null ? null : [...new Set(communityDistrictIds)];
    if (uniqueCommunityDistrictIds !== null) {
      checklist.push(
        this.communityDistrictRepository.checkByBoroughIdCommunityDistrictIds(
          uniqueCommunityDistrictIds,
        ),
      );
    }

    if (facilityOversightAgency !== null) {
      checklist.push(
        this.agencyRepository.checkByInitials(facilityOversightAgency),
      );
    }

    if (facilityCategoryIds !== null) {
      checklist.push(
        this.facilityRepository.checkByFacilityCategoryIds(facilityCategoryIds),
      );
    }

    if (facilityGroupIds !== null) {
      checklist.push(
        this.facilityRepository.checkByFacilityGroupIds(facilityGroupIds),
      );
    }

    if (facilitySubgroupIds !== null) {
      checklist.push(
        this.facilityRepository.checkByFacilitySubgroupIds(facilitySubgroupIds),
      );
    }

    const checkedList = await Promise.all(checklist);

    if (checkedList.some((result) => result === false))
      throw new InvalidRequestParameterException(
        "could not check one or more of the parameters",
      );

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

  async findCsv({
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
  }) {
    const geom: string | null =
      lons !== null || lats !== null || buffer !== null || geometry !== null
        ? await this.spatialService.createGeometryFromParams({
            geometry,
            lats,
            lons,
            buffer,
          })
        : null;
    const bufferFloor = buffer === null ? SIX_DECIMAL_RESOLUTION_FT : buffer;

    const checklist: Array<Promise<boolean>> = [];
    if (geom !== null) {
      checklist.push(this.spatialRepository.checkGeomIsValid(geom));
    }

    const uniqueCityCouncilDistrictIds =
      cityCouncilDistrictIds === null
        ? null
        : [...new Set(cityCouncilDistrictIds)];
    if (uniqueCityCouncilDistrictIds !== null) {
      checklist.push(
        this.cityCouncilDistrictRepository.checkByIds(
          uniqueCityCouncilDistrictIds,
        ),
      );
    }

    const uniqueBoroughIds =
      boroughIds === null ? null : [...new Set(boroughIds)];
    if (uniqueBoroughIds !== null) {
      checklist.push(this.boroughRepository.checkByIds(uniqueBoroughIds));
    }

    const uniqueCommunityDistrictIds =
      communityDistrictIds === null ? null : [...new Set(communityDistrictIds)];
    if (uniqueCommunityDistrictIds !== null) {
      checklist.push(
        this.communityDistrictRepository.checkByBoroughIdCommunityDistrictIds(
          uniqueCommunityDistrictIds,
        ),
      );
    }

    if (facilityOversightAgency !== null) {
      checklist.push(
        this.agencyRepository.checkByInitials(facilityOversightAgency),
      );
    }

    if (facilityCategoryIds !== null) {
      checklist.push(
        this.facilityRepository.checkByFacilityCategoryIds(facilityCategoryIds),
      );
    }

    if (facilityGroupIds !== null) {
      checklist.push(
        this.facilityRepository.checkByFacilityGroupIds(facilityGroupIds),
      );
    }

    if (facilitySubgroupIds !== null) {
      checklist.push(
        this.facilityRepository.checkByFacilitySubgroupIds(facilitySubgroupIds),
      );
    }

    const checkedList = await Promise.all(checklist);

    if (checkedList.some((result) => result === false))
      throw new InvalidRequestParameterException(
        "could not check one or more of the parameters",
      );

    return await this.facilityRepository.findCsv({
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

  async findTiles(params: FindFacilityTilesPathParams) {
    return await this.facilityRepository.findTiles(params);
  }

  async findGeoJsonById(params: FindFacilityGeoJsonByIdPathParams) {
    const facilities = await this.facilityRepository.findGeoJsonById(params);
    if (facilities.length < 1)
      throw new ResourceNotFoundException("cannot find facility geojson");

    const facilityGeoJson = facilities[0];
    const geometry =
      facilityGeoJson.geometry === null
        ? null
        : (JSON.parse(facilityGeoJson.geometry) as MultiPoint);

    const properties = produce(
      facilityGeoJson as Partial<FacilityGeometry>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as FacilityEntity;

    return {
      id: facilityGeoJson.id,
      type: "Feature",
      properties,
      geometry,
    };
  }
}
