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

export class CapitalProjectService {
  constructor(
    @Inject(CapitalProjectRepository)
    private readonly capitalProjectRepository: CapitalProjectRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
  ) {}

  async findMany({
    limit = 20,
    offset = 0,
    cityCouncilDistrictId = null,
    communityDistrictCombinedId = null,
  }: {
    limit?: number;
    offset?: number;
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
  }) {
    const checklist: Array<Promise<unknown | undefined>> = [];
    if (cityCouncilDistrictId !== null)
      checklist.push(
        this.cityCouncilDistrictRepository.checkCityCouncilDistrictById(
          cityCouncilDistrictId,
        ),
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
    const checkedList = await Promise.all(checklist);
    if (checkedList.some((result) => result === undefined))
      throw new InvalidRequestParameterException();

    const capitalProjects = await this.capitalProjectRepository.findMany({
      cityCouncilDistrictId,
      boroughId,
      communityDistrictId,
      limit,
      offset,
    });

    return {
      capitalProjects,
      limit,
      offset,
      total: capitalProjects.length,
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
    if (capitalProjectCheck === undefined)
      throw new ResourceNotFoundException();

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
