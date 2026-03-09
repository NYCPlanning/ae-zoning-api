import { Injectable } from "@nestjs/common";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import {
  FindCommunityBoardBudgetRequestAgenciesQueryParams,
  FindCommunityBoardBudgetRequestByIdPathParams,
  FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
  FindCommunityBoardBudgetRequestTilesPathParams,
} from "src/gen";
import { AgencyRepository } from "src/agency/agency.repository";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { FindCommunityBoardBudgetRequestGeoJsonByIdPathParams } from "src/gen/types/FindCommunityBoardBudgetRequestGeoJsonById";
import {
  CommunityBoardBudgetRequestGeoJsonRepo,
  CommunityBoardBudgetRequestRepo,
} from "./community-board-budget-request.repository.schema";
import { produce } from "immer";
import { Geom } from "src/types";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { Geometry, Position } from "geojson";
import { SIX_DECIMAL_RESOLUTION_FT } from "src/constants";

@Injectable()
export class CommunityBoardBudgetRequestService {
  constructor(
    private readonly communityBoardBudgetRequestRepository: CommunityBoardBudgetRequestRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly spatialRepository: SpatialRepository,
  ) {}

  async findAgencies({
    cbbrPolicyAreaId,
    cbbrNeedGroupId,
  }: FindCommunityBoardBudgetRequestAgenciesQueryParams) {
    if (cbbrNeedGroupId !== undefined) {
      const checkNeedGroupId =
        await this.communityBoardBudgetRequestRepository.checkNeedGroupById(
          cbbrNeedGroupId,
        );
      if (checkNeedGroupId === false)
        throw new InvalidRequestParameterException(
          "Need group id does not exist",
        );
    }

    if (cbbrPolicyAreaId !== undefined) {
      const checkPolicyAreaId =
        await this.communityBoardBudgetRequestRepository.checkPolicyAreaById(
          cbbrPolicyAreaId,
        );
      if (checkPolicyAreaId === false)
        throw new InvalidRequestParameterException(
          "Policy area id does not exist",
        );
    }

    const cbbrAgencies =
      await this.communityBoardBudgetRequestRepository.findAgencies({
        cbbrPolicyAreaId,
        cbbrNeedGroupId,
      });
    return {
      cbbrAgencies,
    };
  }

  async findNeedGroups({
    cbbrPolicyAreaId,
    agencyInitials,
  }: FindCommunityBoardBudgetRequestNeedGroupsQueryParams) {
    if (agencyInitials !== undefined) {
      const checkAgencyInitials =
        await this.agencyRepository.checkByInitials(agencyInitials);
      if (checkAgencyInitials === false) {
        throw new InvalidRequestParameterException(
          "Agency initials do not exist",
        );
      }
    }

    if (cbbrPolicyAreaId !== undefined) {
      const checkPolicyAreaId =
        await this.communityBoardBudgetRequestRepository.checkPolicyAreaById(
          cbbrPolicyAreaId,
        );
      if (checkPolicyAreaId === false)
        throw new InvalidRequestParameterException(
          "Policy area id does not exist",
        );
    }

    const cbbrNeedGroups =
      await this.communityBoardBudgetRequestRepository.findNeedGroups({
        cbbrPolicyAreaId,
        agencyInitials,
      });
    return {
      cbbrNeedGroups,
    };
  }

  async findPolicyAreas({
    cbbrNeedGroupId,
    agencyInitials,
  }: FindCommunityBoardBudgetRequestPolicyAreasQueryParams) {
    if (agencyInitials !== undefined) {
      const checkAgencyInitials =
        await this.agencyRepository.checkByInitials(agencyInitials);
      if (checkAgencyInitials === false) {
        throw new InvalidRequestParameterException(
          "Agency initials do not exist",
        );
      }
    }

    if (cbbrNeedGroupId !== undefined) {
      const checkNeedGroupId =
        await this.communityBoardBudgetRequestRepository.checkNeedGroupById(
          cbbrNeedGroupId,
        );
      if (checkNeedGroupId === false)
        throw new InvalidRequestParameterException(
          "Need group id does not exist",
        );
    }

    const cbbrPolicyAreas =
      await this.communityBoardBudgetRequestRepository.findPolicyAreas({
        cbbrNeedGroupId,
        agencyInitials,
      });
    return {
      cbbrPolicyAreas,
    };
  }

  async findById({ cbbrId }: FindCommunityBoardBudgetRequestByIdPathParams) {
    const communityBoardBudgetRequests =
      await this.communityBoardBudgetRequestRepository.findById({ cbbrId });

    if (communityBoardBudgetRequests.length < 1) {
      throw new ResourceNotFoundException(
        "Cannot find Community Board Budget Request",
      );
    }

    return communityBoardBudgetRequests[0];
  }

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

  async findManyParameterValidation({
    boroughId = null,
    communityDistrictId = null,
    cityCouncilDistrictId = null,
    cbbrPolicyAreaId = null,
    cbbrNeedGroupId = null,
    agencyInitials = null,
    cbbrAgencyCategoryResponseIds = null,
    isMapped = null,
    geom = null,
  }: {
    boroughId?: string | null;
    communityDistrictId?: string | null;
    cityCouncilDistrictId?: string | null;
    cbbrPolicyAreaId?: number | null;
    cbbrNeedGroupId?: number | null;
    agencyInitials?: string | null;
    cbbrAgencyCategoryResponseIds?: Array<number> | null;
    isMapped?: boolean | null;
    geom?: string | null;
  }) {
    // Parameter validations
    if (cityCouncilDistrictId !== null && isMapped !== null) {
      throw new InvalidRequestParameterException(
        "cannot have isMapped filter in conjunction with other geographic filter",
      );
    }

    const checklist: Array<Promise<boolean>> = [];

    if (geom !== null) {
      checklist.push(this.spatialRepository.checkGeomIsValid(geom));
    }

    if (cbbrPolicyAreaId !== null) {
      checklist.push(
        this.communityBoardBudgetRequestRepository.checkPolicyAreaById(
          cbbrPolicyAreaId,
        ),
      );
    }

    if (cbbrNeedGroupId !== null) {
      checklist.push(
        this.communityBoardBudgetRequestRepository.checkNeedGroupById(
          cbbrNeedGroupId,
        ),
      );
    }

    if (agencyInitials !== null) {
      checklist.push(this.agencyRepository.checkByInitials(agencyInitials));
    }

    if (cbbrAgencyCategoryResponseIds !== null) {
      cbbrAgencyCategoryResponseIds.forEach((id) => {
        checklist.push(
          this.communityBoardBudgetRequestRepository.checkAgencyCategoryResponseById(
            id,
          ),
        );
      });
    }

    if (boroughId !== null && communityDistrictId !== null)
      checklist.push(
        this.communityDistrictRepository.checkByBoroughIdCommunityDistrictId(
          boroughId,
          communityDistrictId,
        ),
      );

    if (cityCouncilDistrictId !== null)
      checklist.push(
        this.cityCouncilDistrictRepository.checkById(cityCouncilDistrictId),
      );
    const checkedList = await Promise.all(checklist);

    if (checkedList.some((result) => result === false))
      throw new InvalidRequestParameterException(
        "one or more values for parameters do not exist",
      );

    return;
  }

  async findMany({
    communityDistrictCombinedId = null,
    cityCouncilDistrictId = null,
    cbbrPolicyAreaId = null,
    cbbrNeedGroupId = null,
    agencyInitials = null,
    cbbrType = null,
    cbbrAgencyCategoryResponseIds = null,
    isMapped = null,
    isContinuedSupport = null,
    limit = 20,
    offset = 0,
    geometry = null,
    lats = null,
    lons = null,
    buffer = null,
  }: {
    communityDistrictCombinedId?: string | null;
    cityCouncilDistrictId?: string | null;
    cbbrPolicyAreaId?: number | null;
    cbbrNeedGroupId?: number | null;
    agencyInitials?: string | null;
    cbbrType?: "C" | "E" | null;
    cbbrAgencyCategoryResponseIds?: Array<number> | null;
    isMapped?: boolean | null;
    isContinuedSupport?: boolean | null;
    limit?: number;
    offset?: number;
    geometry?: "Point" | null;
    lats?: Array<number> | null;
    lons?: Array<number> | null;
    buffer?: number | null;
  }) {
    const boroughId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(0, 1)
        : null;
    const communityDistrictId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(1, 3)
        : null;

    const geom: string | null =
      lons !== null || lats !== null || buffer !== null || geometry !== null
        ? await this.createGeometryFromParams({ geometry, lats, lons, buffer })
        : null;

    await this.findManyParameterValidation({
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrAgencyCategoryResponseIds,
      isMapped,
      geom,
    });

    const cbbrTypeExpanded: "Capital" | "Expense" | null =
      cbbrType === "C" ? "Capital" : cbbrType === "E" ? "Expense" : null;

    const bufferFloor = buffer === null ? SIX_DECIMAL_RESOLUTION_FT : buffer;

    // Data queries
    const totalCountParams = {
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrType: cbbrTypeExpanded,
      cbbrAgencyCategoryResponseIds,
      isMapped,
      isContinuedSupport,
      geom,
      buffer: bufferFloor,
    };

    const cbbrsPromise = this.communityBoardBudgetRequestRepository.findMany({
      ...totalCountParams,
      limit,
      offset,
    });

    const cbbrsCountPromise =
      this.communityBoardBudgetRequestRepository.findCount(totalCountParams);

    const [communityBoardBudgetRequests, totalBudgetRequests] =
      await Promise.all([cbbrsPromise, cbbrsCountPromise]);

    return {
      communityBoardBudgetRequests,
      limit,
      offset,
      total: communityBoardBudgetRequests.length,
      totalBudgetRequests,
      order: `${geometry !== null ? "distance, " : ""}id`,
    };
  }

  async findCsv({
    communityDistrictCombinedId = null,
    cityCouncilDistrictId = null,
    cbbrPolicyAreaId = null,
    cbbrNeedGroupId = null,
    agencyInitials = null,
    cbbrType = null,
    cbbrAgencyCategoryResponseIds = null,
    isMapped = null,
    isContinuedSupport = null,
    geometry = null,
    lats = null,
    lons = null,
    buffer = null,
  }: {
    communityDistrictCombinedId?: string | null;
    cityCouncilDistrictId?: string | null;
    cbbrPolicyAreaId?: number | null;
    cbbrNeedGroupId?: number | null;
    agencyInitials?: string | null;
    cbbrType?: "C" | "E" | null;
    cbbrAgencyCategoryResponseIds?: Array<number> | null;
    isMapped?: boolean | null;
    isContinuedSupport?: boolean | null;
    geometry?: "Point" | null;
    lats?: Array<number> | null;
    lons?: Array<number> | null;
    buffer?: number | null;
  }) {
    const boroughId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(0, 1)
        : null;
    const communityDistrictId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(1, 3)
        : null;

    const geom: string | null =
      lons !== null || lats !== null || buffer !== null || geometry !== null
        ? await this.createGeometryFromParams({ geometry, lats, lons, buffer })
        : null;

    await this.findManyParameterValidation({
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrAgencyCategoryResponseIds,
      isMapped,
      geom,
    });

    const cbbrTypeExpanded: "Capital" | "Expense" | null =
      cbbrType === "C" ? "Capital" : cbbrType === "E" ? "Expense" : null;

    const bufferFloor = buffer === null ? SIX_DECIMAL_RESOLUTION_FT : buffer;

    return await this.communityBoardBudgetRequestRepository.findCsv({
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrType: cbbrTypeExpanded,
      cbbrAgencyCategoryResponseIds,
      isMapped,
      isContinuedSupport,
      geom,
      buffer: bufferFloor,
    });
  }

  async findGeoJsonById(
    params: FindCommunityBoardBudgetRequestGeoJsonByIdPathParams,
  ) {
    const communityBoardBudgetRequests =
      await this.communityBoardBudgetRequestRepository.findGeoJsonById(params);

    if (communityBoardBudgetRequests.length < 1)
      throw new ResourceNotFoundException(
        "cannot find community board budget request geojson",
      );

    const communityBoardBudgetRequest = communityBoardBudgetRequests[0];
    const geometry =
      communityBoardBudgetRequest.geometry === null
        ? null
        : JSON.parse(communityBoardBudgetRequest.geometry);

    const properties = produce(
      communityBoardBudgetRequest as Partial<CommunityBoardBudgetRequestGeoJsonRepo>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as CommunityBoardBudgetRequestRepo;

    return {
      id: communityBoardBudgetRequest.id,
      type: "Feature",
      properties,
      geometry,
    };
  }
  async findAgencyCategoryResponses() {
    const cbbrAgencyCategoryResponses =
      await this.communityBoardBudgetRequestRepository.findAgencyCategoryResponses();
    return { cbbrAgencyCategoryResponses };
  }

  async findTiles(params: FindCommunityBoardBudgetRequestTilesPathParams) {
    return await this.communityBoardBudgetRequestRepository.findTiles(params);
  }
}
