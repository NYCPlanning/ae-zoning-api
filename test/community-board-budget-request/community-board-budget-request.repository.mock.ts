import { FindPolicyAreasRepo } from "src/community-board-budget-request/community-board-budget-request.repository.schema";
import { AgencyRepositoryMock } from "test/agency/agency.repository.mock";

export class CommunityBoardBudgetRequestRepositoryMock {
  agencyRepoMock: AgencyRepositoryMock;
  constructor(agencyRepoMock: AgencyRepositoryMock) {
    this.agencyRepoMock = agencyRepoMock;
  }

  cbbrOptionCascade = [
    { policyAreaId: 1, needGroupId: 5, agencyInitials: "DOHMH" },
  ];
  policyAreas = [
    {
      id: 1,
      description: "Health Care and Human Services",
    },
    {
      id: 2,
      description: "Youth Education and Child Welfare",
    },
    {
      id: 3,
      description: "Public Safety and Emergency Services",
    },
    {
      id: 4,
      description: "Core Infrastructure, City Services, and Resiliency",
    },
    {
      id: 5,
      description: "Housing, Land Use, and Economic Development",
    },
    {
      id: 6,
      description: "Transportation and Mobility",
    },
    {
      id: 7,
      description: "Parks, Cultural and Other Community Facilities",
    },
    {
      id: 8,
      description: "Other Needs",
    },
  ];

  async findPolicyAreas({
    cbbrNeedGroupId = null,
    agencyInitials = null,
  }: {
    cbbrNeedGroupId: number | null;
    agencyInitials: string | null;
  }): Promise<FindPolicyAreasRepo> {
    return this.policyAreas.filter((policyArea) =>
      this.cbbrOptionCascade.some(
        (option) =>
          (cbbrNeedGroupId !== null || agencyInitials !== null
            ? option.policyAreaId === policyArea.id
            : true) &&
          (cbbrNeedGroupId !== null
            ? option.needGroupId === cbbrNeedGroupId
            : true) &&
          (agencyInitials !== null
            ? option.agencyInitials === agencyInitials
            : true),
      ),
    );
  }
}
