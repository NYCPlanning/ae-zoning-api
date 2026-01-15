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

@Injectable()
export class CapitalProjectService {
  constructor(
    private readonly capitalProjectRepository: CapitalProjectRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly agencyBudgetRepository: AgencyBudgetRepository,
    private readonly boroughRepository: BoroughRepository,
  ) {}

  async findMany({
    limit = 20,
    offset = 0,
    cityCouncilDistrictId = null,
    boroughId = null,
    communityDistrictId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
    isMapped = null,
  }: {
    limit?: number;
    offset?: number;
    cityCouncilDistrictId?: string | null;
    boroughId?: string | null;
    communityDistrictId?: string | null;
    managingAgency?: string | null;
    agencyBudget?: string | null;
    commitmentsTotalMin?: string | null;
    commitmentsTotalMax?: string | null;
    isMapped?: boolean | null;
  }) {
    const min = commitmentsTotalMin
      ? parseFloat(commitmentsTotalMin.replaceAll(",", ""))
      : null;
    const max = commitmentsTotalMax
      ? parseFloat(commitmentsTotalMax.replaceAll(",", ""))
      : null;

    if (
      (cityCouncilDistrictId !== null || boroughId !== null) &&
      isMapped !== null
    ) {
      throw new InvalidRequestParameterException(
        "cannot have isMapped filter in conjunction with other geographic filter",
      );
    }

    if (communityDistrictId !== null && boroughId === null) {
      throw new InvalidRequestParameterException(
        "cannot filter by community district id without borough id",
      );
    }

    if (min !== null && max !== null && min > max) {
      throw new InvalidRequestParameterException(
        "min amount should be less than max amount",
      );
    }

    const checklist: Array<Promise<unknown | undefined>> = [];
    if (cityCouncilDistrictId !== null)
      checklist.push(
        this.cityCouncilDistrictRepository.checkById(cityCouncilDistrictId),
      );

    if (boroughId !== null && communityDistrictId === null)
      checklist.push(this.boroughRepository.checkById(boroughId));

    if (boroughId !== null && communityDistrictId !== null)
      checklist.push(
        this.communityDistrictRepository.checkByBoroughIdCommunityDistrictId(
          boroughId,
          communityDistrictId,
        ),
      );

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

    const capitalProjectsPromise = this.capitalProjectRepository.findMany({
      cityCouncilDistrictId,
      boroughId,
      communityDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: min,
      commitmentsTotalMax: max,
      isMapped,
      limit,
      offset,
    });

    const totalProjectsPromise = this.capitalProjectRepository.findCount({
      cityCouncilDistrictId,
      boroughId,
      communityDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: min,
      commitmentsTotalMax: max,
      isMapped,
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
      order: "managingCode, capitalProjectId",
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
