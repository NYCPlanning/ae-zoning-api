import type { Error } from "./Error";
import type { CapitalProjectBudgeted } from "./CapitalProjectBudgeted";

export type FindCapitalProjectByManagingCodeCapitalProjectIdPathParams = {
  /**
   * @description Three character string of numbers representing managing agency
   * @type string
   * @example 801
   */
  managingCode: string;
  /**
   * @description The id for the project, which combines with the managing code to make a unique id
   * @type string
   * @example HWPEDSF5
   */
  capitalProjectId: string;
};

export type FindCapitalProjectByManagingCodeCapitalProjectId400 = Error;

export type FindCapitalProjectByManagingCodeCapitalProjectId404 = Error;

export type FindCapitalProjectByManagingCodeCapitalProjectId500 = Error;

/**
 * @description An object of capital project details
 */
export type FindCapitalProjectByManagingCodeCapitalProjectIdQueryResponse =
  CapitalProjectBudgeted;
