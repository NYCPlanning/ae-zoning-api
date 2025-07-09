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
import {
  FILE_STORAGE,
  FileStorageService,
} from "src/global/providers/file-storage.provider";
import { FindCsvUrlQueryParams } from "./capital-project.controller";
import { unparse } from "papaparse";

export class CapitalProjectService {
  constructor(
    @Inject(CapitalProjectRepository)
    private readonly capitalProjectRepository: CapitalProjectRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly agencyBudgetRepository: AgencyBudgetRepository,

    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorageService,
  ) {}

  async findManyParameterCheck({
    cityCouncilDistrictId = null,
    communityDistrictCombinedId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
    isMapped = null,
  }: {
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
    managingAgency?: string | null;
    agencyBudget?: string | null;
    commitmentsTotalMin?: number | null;
    commitmentsTotalMax?: number | null;
    isMapped?: boolean | null;
  }) {
    if (
      (cityCouncilDistrictId !== null ||
        communityDistrictCombinedId !== null) &&
      isMapped !== null
    ) {
      throw new InvalidRequestParameterException();
    }

    if (
      commitmentsTotalMin !== null &&
      commitmentsTotalMax !== null &&
      commitmentsTotalMin > commitmentsTotalMax
    ) {
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

    return;
  }

  async findManyHelper({
    limit,
    offset = 0,
    cityCouncilDistrictId = null,
    communityDistrictCombinedId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
    isMapped = null,
  }: {
    limit?: number | null;
    offset?: number;
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
    managingAgency?: string | null;
    agencyBudget?: string | null;
    commitmentsTotalMin?: number | null;
    commitmentsTotalMax?: number | null;
    isMapped?: boolean | null;
  }) {
    await this.findManyParameterCheck({
      cityCouncilDistrictId,
      communityDistrictCombinedId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin,
      commitmentsTotalMax,
      isMapped,
    });

    const boroughId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(0, 1)
        : null;
    const communityDistrictId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(1, 3)
        : null;

    return await this.capitalProjectRepository.findMany({
      limit: limit ? limit : 1000000000,
      offset,
      cityCouncilDistrictId,
      boroughId,
      communityDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin,
      commitmentsTotalMax,
      isMapped,
    });
  }

  async findMany({
    limit = 20,
    offset = 0,
    cityCouncilDistrictId = null,
    communityDistrictCombinedId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
    isMapped = null,
  }: {
    limit?: number;
    offset?: number;
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
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

    const capitalProjectsPromise = this.findManyHelper({
      cityCouncilDistrictId,
      communityDistrictCombinedId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: min,
      commitmentsTotalMax: max,
      isMapped,
      limit,
      offset,
    });

    const boroughId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(0, 1)
        : null;
    const communityDistrictId =
      communityDistrictCombinedId !== null
        ? communityDistrictCombinedId.slice(1, 3)
        : null;

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

  async findCsvUrl(params: FindCsvUrlQueryParams) {
    const fileName = this.fileStorage.getFileName(
      "capital-projects",
      params,
      ".csv",
    );

    return await this.fileStorage.getFileUrl(fileName);
  }

  async replaceCsv(params: FindCsvUrlQueryParams) {
    const {
      communityDistrictId: communityDistrictCombinedId,
      cityCouncilDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMax,
      commitmentsTotalMin,
      isMapped,
    } = params;
    const min = commitmentsTotalMin
      ? parseFloat(commitmentsTotalMin.replaceAll(",", ""))
      : null;
    const max = commitmentsTotalMax
      ? parseFloat(commitmentsTotalMax.replaceAll(",", ""))
      : null;
    this.findManyParameterCheck({
      communityDistrictCombinedId,
      cityCouncilDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMax: max,
      commitmentsTotalMin: min,
      isMapped,
    });
    const boroughId =
      communityDistrictCombinedId !== undefined
        ? communityDistrictCombinedId.slice(0, 1)
        : null;
    const communityDistrictId =
      communityDistrictCombinedId !== undefined
        ? communityDistrictCombinedId.slice(1, 3)
        : null;
    const capitalProjects = await this.capitalProjectRepository.replaceCsv({
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMax: max,
      commitmentsTotalMin: min,
      isMapped,
    });
    const fileName = this.fileStorage.getFileName(
      "capital-projects",
      params,
      ".csv",
    );
    const csv = Buffer.from(unparse(capitalProjects));
    return await this.fileStorage.replaceFile(fileName, csv);
  }

  async findManyDownload({
    cityCouncilDistrictId = null,
    communityDistrictCombinedId = null,
    managingAgency = null,
    agencyBudget = null,
    commitmentsTotalMin = null,
    commitmentsTotalMax = null,
    isMapped = null,
  }: {
    cityCouncilDistrictId?: string | null;
    communityDistrictCombinedId?: string | null;
    managingAgency?: string | null;
    agencyBudget?: string | null;
    commitmentsTotalMin?: string | null;
    commitmentsTotalMax?: string | null;
    isMapped?: boolean | null;
  }) {
    return await this.findManyHelper({
      cityCouncilDistrictId,
      communityDistrictCombinedId,
      managingAgency,
      agencyBudget,
      commitmentsTotalMin: commitmentsTotalMin
        ? parseFloat(commitmentsTotalMin.replaceAll(",", ""))
        : null,
      commitmentsTotalMax: commitmentsTotalMax
        ? parseFloat(commitmentsTotalMax.replaceAll(",", ""))
        : null,
      isMapped,
    });
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
