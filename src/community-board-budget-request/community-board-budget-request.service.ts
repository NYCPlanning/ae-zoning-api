import { Inject, Injectable } from "@nestjs/common";
import { CommunityBoardBudgetRequestRepository } from "./community-board-budget-request.repository";
import {
  FindCommunityBoardBudgetRequestNeedGroupsQueryParams,
  FindCommunityBoardBudgetRequestPolicyAreasQueryParams,
} from "src/gen";
import { AgencyRepository } from "src/agency/agency.repository";
import { InvalidRequestParameterException } from "src/exception";

@Injectable()
export class CommunityBoardBudgetRequestService {
  constructor(
    @Inject(CommunityBoardBudgetRequestRepository)
    private readonly communityBoardBudgetRequestRepository: CommunityBoardBudgetRequestRepository,
    private readonly agencyRepository: AgencyRepository,
  ) {}

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
}
