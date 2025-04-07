import { produce } from "immer";
import {
  FindCapitalCommitmentsByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  FindCapitalProjectTilesPathParams,
} from "src/gen";
import { CapitalProjectRepository } from "./capital-project.repository";
import { Inject } from "@nestjs/common";
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

export class CapitalProjectService {
  constructor(
    @Inject(CapitalProjectRepository)
    private readonly capitalProjectRepository: CapitalProjectRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly agencyBudgetRepository: AgencyBudgetRepository,
  ) {}

  async findMany({
    limit = 20,
    offset = 0,
    cityCouncilDistrictId = null,
    communityDistrictCombinedId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
  }: {
    limit?: number;
    offset?: number;
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
    managingAgency?: string | null;
    agencyBudget?: string | null;
    commitmentsTotalMin?: string | null;
    commitmentsTotalMax?: string | null;
  }) {
    const min = commitmentsTotalMin
      ? parseFloat(commitmentsTotalMin.replaceAll(",", ""))
      : null;
    const max = commitmentsTotalMax
      ? parseFloat(commitmentsTotalMax.replaceAll(",", ""))
      : null;

    if (min !== null && max !== null && min > max) {
      throw new InvalidRequestParameterException();
    }

    const checklist: Array<Promise<unknown | undefined>> = [];
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

    if (managingAgency !== null) {
      checklist.push(this.agencyRepository.checkByInitials(managingAgency));
    }

    if (agencyBudget !== null) {
      checklist.push(this.agencyBudgetRepository.checkByCode(agencyBudget));
    }

    const checkedList = await Promise.all(checklist);

    if (checkedList.some((result) => result === false))
      throw new InvalidRequestParameterException();

    const capitalProjectsPromise = this.capitalProjectRepository.findMany({
      cityCouncilDistrictId,
      boroughId,
      communityDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: min,
      commitmentsTotalMax: max,
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

  async findByManagingCodeCapitalProjectId(
    params: FindCapitalProjectByManagingCodeCapitalProjectIdPathParams,
  ) {
    const capitalProjects =
      await this.capitalProjectRepository.findByManagingCodeCapitalProjectId(
        params,
      );

    if (capitalProjects.length < 1) throw new ResourceNotFoundException();
    return capitalProjects[0];
  }

  async findGeoJsonByManagingCodeCapitalProjectId(
    params: FindCapitalProjectGeoJsonByManagingCodeCapitalProjectIdPathParams,
  ) {
    const capitalProjects =
      await this.capitalProjectRepository.findGeoJsonByManagingCodeCapitalProjectId(
        params,
      );

    if (capitalProjects.length < 1) throw new ResourceNotFoundException();

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
    if (capitalProjectCheck === false) throw new ResourceNotFoundException();

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
