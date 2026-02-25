import { produce } from "immer";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectTilesPathParams,
} from "src/gen";
import { CapitalProjectRepository } from "./capital-project.repository";
import { Injectable } from "@nestjs/common";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import {
  CapitalProjectBudgetedEntity,
  CapitalProjectBudgetedGeoJsonEntityRepo,
} from "./capital-project.repository.schema";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";
import { AgencyRepository } from "src/agency/agency.repository";
import { AgencyBudgetRepository } from "src/agency-budget/agency-budget.repository";
import { BoroughRepository } from "src/borough/borough.repository";
import { Geom } from "src/types";
import { SpatialRepository } from "src/spatial/spatial.repository";
import { Geometry, Position } from "geojson";
import { SIX_DECIMAL_RESOLUTION_FT } from "src/constants";

@Injectable()
export class CapitalProjectService {
  constructor(
    private readonly boroughRepository: BoroughRepository,
    private readonly capitalProjectRepository: CapitalProjectRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly agencyBudgetRepository: AgencyBudgetRepository,
    private readonly spatialRepository: SpatialRepository,
  ) {}

  async findMany({
    limit = 20,
    offset = 0,
    cityCouncilDistrictId = null,
    boroughIds = null,
    communityDistrictCombinedId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
    isMapped = null,
    geometry = null,
    lats = null,
    lons = null,
    buffer = null,
  }: {
    limit?: number;
    offset?: number;
    boroughIds?: Array<string> | null;
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
    managingAgency?: string | null;
    agencyBudget?: string | null;
    commitmentsTotalMin?: string | null;
    commitmentsTotalMax?: string | null;
    isMapped?: boolean | null;
    geometry?: "Point" | null;
    lats?: Array<number> | null;
    lons?: Array<number> | null;
    buffer?: number | null;
  }) {
    const min = commitmentsTotalMin
      ? parseFloat(commitmentsTotalMin.replaceAll(",", ""))
      : null;
    const max = commitmentsTotalMax
      ? parseFloat(commitmentsTotalMax.replaceAll(",", ""))
      : null;

    if (
      (cityCouncilDistrictId !== null ||
        communityDistrictCombinedId !== null ||
        geometry !== null ||
        boroughIds !== null) &&
      isMapped !== null
    ) {
      throw new InvalidRequestParameterException(
        "cannot have isMapped filter in conjunction with other geographic filter",
      );
    }

    if (min !== null && max !== null && min > max) {
      throw new InvalidRequestParameterException(
        "min amount should be less than max amount",
      );
    }

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

    const checklist: Array<Promise<boolean>> = [];
    if (geom !== null) {
      checklist.push(this.spatialRepository.checkGeomIsValid(geom));
    }
    if (cityCouncilDistrictId !== null)
      checklist.push(
        this.cityCouncilDistrictRepository.checkById(cityCouncilDistrictId),
      );

    const boroughId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(0, 1)
        : null;
    const communityDistrictId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(1, 3)
        : null;

    if (boroughId !== null && communityDistrictId !== null)
      checklist.push(
        this.communityDistrictRepository.checkByBoroughIdCommunityDistrictId(
          boroughId,
          communityDistrictId,
        ),
      );

    const uniqueBoroughIds =
      boroughIds === null ? null : [...new Set(boroughIds)];
    if (uniqueBoroughIds !== null) {
      checklist.push(this.boroughRepository.checkByIds(uniqueBoroughIds));
    }

    if (managingAgency !== null) {
      checklist.push(this.agencyRepository.checkByInitials(managingAgency));
    }

    if (agencyBudget !== null) {
      checklist.push(this.agencyBudgetRepository.checkByCode(agencyBudget));
    }

    const checkedList = await Promise.all(checklist);

    if (checkedList.some((result) => result === false))
      throw new InvalidRequestParameterException(
        "could not check one or more of the parameters",
      );

    const bufferFloor = buffer === null ? SIX_DECIMAL_RESOLUTION_FT : buffer;
    const capitalProjectsPromise = this.capitalProjectRepository.findMany({
      cityCouncilDistrictId,
      boroughId,
      boroughIds: uniqueBoroughIds,
      communityDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: min,
      commitmentsTotalMax: max,
      isMapped,
      limit,
      offset,
      geom,
      buffer: bufferFloor,
    });

    const totalProjectsPromise = this.capitalProjectRepository.findCount({
      cityCouncilDistrictId,
      boroughId,
      boroughIds: uniqueBoroughIds,
      communityDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: min,
      commitmentsTotalMax: max,
      isMapped,
      geom,
      buffer: bufferFloor,
    });

    const [capitalProjects, totalProjects] = await Promise.all([
      capitalProjectsPromise,
      totalProjectsPromise,
    ]);

    return {
      capitalProjects,
      limit,
      offset,
      total: capitalProjects.length,
      totalProjects,
      order: `${geometry !== null ? "distance, " : ""}managingCode, capitalProjectId`,
    };
  }

  async findManagingAgencies() {
    const managingAgencies =
      await this.capitalProjectRepository.findManagingAgencies();
    return {
      managingAgencies,
      order: "initials",
    };
  }

  async findByManagingCodeCapitalProjectId(
    params: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  ) {
    const capitalProjects =
      await this.capitalProjectRepository.findByManagingCodeCapitalProjectId(
        params,
      );

    if (capitalProjects.length < 1)
      throw new ResourceNotFoundException("cannot find capital project");
    return capitalProjects[0];
  }

  async findGeoJsonByManagingCodeCapitalProjectId(
    params: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  ) {
    const capitalProjects =
      await this.capitalProjectRepository.findGeoJsonByManagingCodeCapitalProjectId(
        params,
      );

    if (capitalProjects.length < 1)
      throw new ResourceNotFoundException(
        "cannot find capital project geojson",
      );

    const capitalProject = capitalProjects[0];

    const geometry =
      capitalProject.geometry === null
        ? null
        : JSON.parse(capitalProject.geometry);

    const properties = produce(
      capitalProject as Partial<CapitalProjectBudgetedGeoJsonEntityRepo>,
      (draft) => {
        delete draft["geometry"];
      },
    ) as CapitalProjectBudgetedEntity;

    return {
      id: `${capitalProject.managingCode}${capitalProject.id}`,
      type: "Feature",
      properties,
      geometry,
    };
  }

  async findTiles(params: FindCapitalProjectTilesPathParams) {
    return await this.capitalProjectRepository.findTiles(params);
  }

  async findCapitalCommitmentsByManagingCodeCapitalProjectId(
    params: FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  ) {
    const capitalProjectCheck =
      await this.capitalProjectRepository.checkByManagingCodeCapitalProjectId(
        params.managingCode,
        params.capitalProjectId,
      );
    if (capitalProjectCheck === false)
      throw new ResourceNotFoundException(
        "cannot find capital project for commitments",
      );

    const capitalCommitments =
      await this.capitalProjectRepository.findCapitalCommitmentsByManagingCodeCapitalProjectId(
        params,
      );

    return {
      capitalCommitments,
      order: "plannedDate",
    };
  }
}
