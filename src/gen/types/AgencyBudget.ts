export type AgencyBudget = {
  /**
   * @description A string of variable length containing the abbreviation of the agency budget
   * @type string
   */
  code: string;
  /**
   * @description The title of the budget.
   * @type string
   */
  type: string;
  /**
   * @description The initials of the sponsoring agency
   * @type string
   */
  sponsor: string;
};
