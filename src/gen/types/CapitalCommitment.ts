export type CapitalCommitment = {
  /**
   * @description A uuid used to refer to the capital commitment.
   * @type string, uuid
   */
  id: string;
  /**
   * @description A four character string used to refer to the commitment type.
   * @type string
   */
  type: string;
  /**
   * @description A string used to refer to the date when the commitment is projected to be committed.
   * @type string, date
   */
  plannedDate: string;
  /**
   * @description A string used to refer to the budget line.
   * @type string
   */
  budgetLineCode: string;
  /**
   * @description A string used to refer to the budget line.
   * @type string
   */
  budgetLineId: string;
  /**
   * @description A string of variable length containing the initials of the sponsoring agency.
   * @type string
   */
  sponsoringAgencyInitials: string;
  /**
   * @description A string of variable length denoting the type of budget.
   * @type string
   */
  budgetType: string;
  /**
   * @description A numeric string used to refer to the amount of total planned commitments.
   * @type number
   */
  totalValue: number;
};
