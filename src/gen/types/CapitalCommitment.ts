export type CapitalCommitment = {
  /**
   * @description A uuid used to refer to the capital commitment.
   * @type string | undefined uuid
   */
  id?: string;
  /**
   * @description A four character string used to refer to the commitment type.
   * @type string | undefined
   * @example DSGN
   */
  type?: string;
  /**
   * @description A string used to refer to the date when the commitment is projected to be committed.
   * @type string | undefined date
   * @example 2012-04-23
   */
  plannedDate?: string;
  /**
   * @description A string used to refer to the budget line.
   * @type string | undefined
   * @example HW
   */
  budgetLineCode?: string;
  /**
   * @description A string used to refer to the budget line.
   * @type string | undefined
   * @example 0002Q
   */
  budgetLineId?: string;
  /**
   * @description A string of variable length containing the initials of the sponsoring agency.
   * @type string | undefined
   * @example DOT
   */
  sponsoringAgencyInitials?: string;
  /**
   * @description A string of variable length denoting the type of budget.
   * @type string | undefined
   * @example Highways
   */
  budgetType?: string;
  /**
   * @description A numeric string used to refer to the amount of total planned commitments.
   * @type number | undefined
   * @example 1600000
   */
  totalValue?: number;
  required?: any;
};
