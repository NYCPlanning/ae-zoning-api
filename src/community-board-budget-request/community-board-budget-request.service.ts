import { Inject, Injectable } from "@nestjs/common";
import { CityCouncilDistrictRepository } from "src/city-council-district/city-council-district.repository";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import {
  FindCommunityBoardBudgetRequestAgenciesQueryParams,
  FindCommunityBoardBudgetRequestByIdPathParams,
  FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
} from "src/gen";
import { AgencyRepository } from "src/agency/agency.repository";
import {
  InvalidRequestParameterException,
  ResourceNotFoundException,
} from "src/exception";
import { CommunityDistrictRepository } from "src/community-district/community-district.repository";

@Injectable()
export class CommunityBoardBudgetRequestService {
  constructor(
    @Inject(CommunityBoardBudgetRequestRepository)
    private readonly communityBoardBudgetRequestRepository: CommunityBoardBudgetRequestRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly communityDistrictRepository: CommunityDistrictRepository,
    private readonly cityCouncilDistrictRepository: CityCouncilDistrictRepository,
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

  async findMany({
    communityDistrictCombinedId = null,
    cityCouncilDistrictId = null,
    cbbrPolicyAreaId = null,
    cbbrNeedGroupId = null,
    agencyInitials = null,
    cbbrType = null,
    cbbrAgencyResponseTypeId = null,
    isMapped = null,
    isContinuedSupport = null,
    limit = 20,
    offset = 0,
  }: {
    communityDistrictCombinedId?: string | null;
    cityCouncilDistrictId?: string | null;
    cbbrPolicyAreaId?: number | null;
    cbbrNeedGroupId?: number | null;
    agencyInitials?: string | null;
    cbbrType?: "C" | "E" | null;
    cbbrAgencyResponseTypeId?: Array<number> | null;
    isMapped?: boolean | null;
    isContinuedSupport?: boolean | null;
    limit?: number;
    offset?: number;
  }) {
    // Parameter validations
    if (cityCouncilDistrictId !== null && isMapped !== null) {
      throw new InvalidRequestParameterException(
        "cannot have isMapped filter in conjunction with other geographic filter",
      );
    }

    const checklist: Array<Promise<unknown | undefined>> = [];

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

    if (cbbrAgencyResponseTypeId !== null) {
      cbbrAgencyResponseTypeId.forEach((id) => {
        checklist.push(
          this.communityBoardBudgetRequestRepository.checkAgencyResponseTypeById(
            id,
          ),
        );
      });
    }

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

    if (cityCouncilDistrictId !== null)
      checklist.push(
        this.cityCouncilDistrictRepository.checkById(cityCouncilDistrictId),
      );
    const checkedList = await Promise.all(checklist);

    if (checkedList.some((result) => result === false))
      throw new InvalidRequestParameterException(
        "one or more values for parameters do not exist",
      );

    const cbbrTypeExpanded: "Capital" | "Expense" | null =
      cbbrType === "C" ? "Capital" : cbbrType === "E" ? "Expense" : null;

    // Data queries
    const totalCountParams = {
      boroughId,
      communityDistrictId,
      cityCouncilDistrictId,
      cbbrPolicyAreaId,
      cbbrNeedGroupId,
      agencyInitials,
      cbbrType: cbbrTypeExpanded,
      cbbrAgencyResponseTypeId,
      isMapped,
      isContinuedSupport,
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
    };
  }
}
